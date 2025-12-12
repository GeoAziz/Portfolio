/**
 * Webhooks Management API
 * POST /api/webhooks - Create new webhook
 * GET /api/webhooks - List user webhooks
 * PUT /api/webhooks/[id] - Update webhook
 * DELETE /api/webhooks/[id] - Delete webhook
 * GET /api/webhooks/logs - Get webhook delivery logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyJWTToken, extractTokenFromHeader } from '@/lib/auth';
import {
  registerWebhook,
  getUserWebhooks,
  deleteWebhook as deleteWebhookUtil,
  getWebhookLogs,
  triggerWebhook,
} from '@/lib/webhooks';
import { checkUserRateLimit, rateLimitConfigs } from '@/lib/rate-limiting';

// Validation schemas
const WebhookCreateSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  active: z.boolean().optional().default(true),
});

const WebhookUpdateSchema = z.object({
  url: z.string().url('Invalid webhook URL').optional(),
  events: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

/**
 * Verify user authentication
 */
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const decoded = await verifyJWTToken(token);
  if (!decoded) {
    return { error: 'Invalid token', status: 401 };
  }

  return { userId: decoded.userId, status: 200 };
}

/**
 * POST /api/webhooks - Create new webhook
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Rate limiting
    const rateLimitResult = checkUserRateLimit(auth.userId, rateLimitConfigs.webhook);
    if (rateLimitResult.limited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = WebhookCreateSchema.parse(body);

    const result = await registerWebhook(
      auth.userId,
      validated.url,
      validated.events as any
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, webhook: result.webhook }, { status: 201 });
  } catch (error) {
    console.error('Webhook creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Failed to create webhook' }, { status: 500 });
  }
}

/**
 * GET /api/webhooks - List user webhooks
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'logs') {
      // Get webhook logs
      const webhookId = url.searchParams.get('webhookId');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      if (!webhookId) {
        return NextResponse.json({ success: false, error: 'Missing webhookId' }, { status: 400 });
      }

      const logs = await getWebhookLogs(webhookId, limit);
      return NextResponse.json({ success: true, logs });
    }

    if (action === 'test') {
      // Test webhook by triggering a test event
      const webhookId = url.searchParams.get('id');
      if (!webhookId) {
        return NextResponse.json({ success: false, error: 'Missing webhook ID' }, { status: 400 });
      }

      // Trigger a test event
      await triggerWebhook('analytics.event', {
        type: 'webhook_test',
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: 'Test event sent' });
    }

    // List all webhooks for user
    const webhooks = await getUserWebhooks(auth.userId);
    return NextResponse.json({ success: true, webhooks, count: webhooks.length });
  } catch (error) {
    console.error('Webhook list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

/**
 * PUT /api/webhooks/[id] - Update webhook
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing webhook ID' }, { status: 400 });
    }

    const body = await request.json();
    const validated = WebhookUpdateSchema.parse(body);

    // For now, return a message that updates are not yet supported
    // In a full implementation, this would update the webhook
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook updates coming soon',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Webhook update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Failed to update webhook' }, { status: 500 });
  }
}

/**
 * DELETE /api/webhooks/[id] - Delete webhook
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing webhook ID' }, { status: 400 });
    }

    const result = await deleteWebhookUtil(auth.userId, id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Webhook not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete webhook' }, { status: 500 });
  }
}
