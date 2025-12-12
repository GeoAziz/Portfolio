/**
 * Webhook system for event notifications
 * Supports events: content.created, content.updated, content.deleted,
 * user.registered, user.updated, comment.created, etc.
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type WebhookEvent =
  | 'content.created'
  | 'content.updated'
  | 'content.deleted'
  | 'user.registered'
  | 'user.updated'
  | 'comment.created'
  | 'comment.deleted'
  | 'analytics.event';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, any>;
  signature?: string;
}

export interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const WEBHOOKS_FILE = path.join(DATA_DIR, 'webhooks.json');
const WEBHOOK_LOGS_FILE = path.join(DATA_DIR, 'webhook-logs.jsonl');

/**
 * Load webhooks from file
 */
async function loadWebhooks(): Promise<Webhook[]> {
  try {
    const data = await fs.readFile(WEBHOOKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save webhooks to file
 */
async function saveWebhooks(webhooks: Webhook[]) {
  await fs.writeFile(WEBHOOKS_FILE, JSON.stringify(webhooks, null, 2), 'utf-8');
}

/**
 * Create a signature for webhook payload
 */
export function createWebhookSignature(payload: WebhookPayload, secret: string): string {
  const message = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: WebhookPayload,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Register a new webhook
 */
export async function registerWebhook(
  userId: string,
  url: string,
  events: WebhookEvent[]
): Promise<{ success: boolean; webhook?: Webhook; error?: string }> {
  try {
    const webhooks = await loadWebhooks();
    const secret = crypto.randomBytes(32).toString('hex');
    const now = new Date().toISOString();

    const webhook: Webhook = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      url,
      events,
      secret,
      active: true,
      createdAt: now,
      updatedAt: now,
      failureCount: 0,
    };

    webhooks.push(webhook);
    await saveWebhooks(webhooks);

    return { success: true, webhook };
  } catch (error) {
    console.error('Error registering webhook:', error);
    return { success: false, error: 'Failed to register webhook' };
  }
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(
  userId: string,
  webhookId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const webhooks = await loadWebhooks();
    const webhook = webhooks.find((w) => w.id === webhookId && w.userId === userId);

    if (!webhook) {
      return { success: false, error: 'Webhook not found' };
    }

    const filtered = webhooks.filter((w) => w.id !== webhookId);
    await saveWebhooks(filtered);

    return { success: true };
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return { success: false, error: 'Failed to delete webhook' };
  }
}

/**
 * Get user's webhooks
 */
export async function getUserWebhooks(userId: string): Promise<Webhook[]> {
  try {
    const webhooks = await loadWebhooks();
    return webhooks.filter((w) => w.userId === userId);
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return [];
  }
}

/**
 * Trigger a webhook event (async, fires in background)
 */
export async function triggerWebhook(
  event: WebhookEvent,
  data: Record<string, any>
) {
  try {
    const webhooks = await loadWebhooks();
    const matchingWebhooks = webhooks.filter(
      (w) => w.active && w.events.includes(event)
    );

    if (matchingWebhooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    // Fire all matching webhooks in parallel (non-blocking)
    for (const webhook of matchingWebhooks) {
      deliverWebhook(webhook, payload).catch((error) =>
        console.error(`Failed to deliver webhook ${webhook.id}:`, error)
      );
    }
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
}

/**
 * Deliver webhook with retry logic
 */
async function deliverWebhook(webhook: Webhook, payload: WebhookPayload) {
  const signature = createWebhookSignature(payload, webhook.secret);
  const signedPayload = { ...payload, signature };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': payload.timestamp,
      },
      body: JSON.stringify(signedPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Log webhook delivery
    await logWebhookDelivery(webhook.id, payload.event, response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Reset failure count on success
    const webhooks = await loadWebhooks();
    const idx = webhooks.findIndex((w) => w.id === webhook.id);
    if (idx !== -1) {
      webhooks[idx].failureCount = 0;
      webhooks[idx].lastTriggeredAt = new Date().toISOString();
      await saveWebhooks(webhooks);
    }
  } catch (error) {
    console.error(`Webhook delivery failed: ${webhook.url}`, error);

    // Increment failure count and disable after 10 failures
    const webhooks = await loadWebhooks();
    const idx = webhooks.findIndex((w) => w.id === webhook.id);
    if (idx !== -1) {
      webhooks[idx].failureCount += 1;
      if (webhooks[idx].failureCount >= 10) {
        webhooks[idx].active = false;
      }
      await saveWebhooks(webhooks);
    }

    // Log failed delivery
    await logWebhookDelivery(webhook.id, payload.event, 0, error as Error);
  }
}

/**
 * Log webhook delivery attempt
 */
async function logWebhookDelivery(
  webhookId: string,
  event: WebhookEvent,
  statusCode: number,
  error?: Error
) {
  try {
    const log = {
      webhookId,
      event,
      statusCode,
      error: error?.message,
      timestamp: new Date().toISOString(),
    };

    const line = JSON.stringify(log);
    await fs.appendFile(WEBHOOK_LOGS_FILE, line + '\n', 'utf-8');
  } catch (error) {
    console.error('Error logging webhook delivery:', error);
  }
}

/**
 * Get webhook delivery logs
 */
export async function getWebhookLogs(webhookId: string, limit = 100): Promise<any[]> {
  try {
    const data = await fs.readFile(WEBHOOK_LOGS_FILE, 'utf-8');
    const logs = data
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((log) => log.webhookId === webhookId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return logs;
  } catch {
    return [];
  }
}
