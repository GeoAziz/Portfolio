import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// File-based storage for messages
const CONTACTS_FILE = join(process.cwd(), '.data', 'contacts.json');

async function loadMessages() {
  try {
    const data = await readFile(CONTACTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.messages || [];
  } catch {
    return [];
  }
}

async function saveMessages(messages: any[]) {
  try {
    await writeFile(CONTACTS_FILE, JSON.stringify({ messages }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

// Simple rate limiting: track IP + email combinations
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 messages per hour per IP

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(';')[0].trim() : 'unknown';
}

function checkRateLimit(ip: string, email: string): { allowed: boolean; resetInSeconds: number } {
  const key = `${ip}:${email}`;
  const now = Date.now();

  const limiter = rateLimitMap.get(key);

  if (!limiter || now > limiter.resetTime) {
    // Reset the limiter
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, resetInSeconds: 0 };
  }

  if (limiter.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetInSeconds = Math.ceil((limiter.resetTime - now) / 1000);
    return { allowed: false, resetInSeconds };
  }

  limiter.count++;
  return { allowed: true, resetInSeconds: 0 };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateContactData(data: any): { valid: boolean; error?: string } {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    return { valid: false, error: 'Valid email is required' };
  }

  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    return { valid: false, error: 'Subject is required' };
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }

  if (data.message.length > 5000) {
    return { valid: false, error: 'Message cannot exceed 5000 characters' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Parse request body
    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Validate data
    const validation = validateContactData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    // Check rate limit
    const { allowed, resetInSeconds } = checkRateLimit(clientIp, data.email);
    if (!allowed) {
      return NextResponse.json(
        {
          message: `Too many messages from this email address. Please try again in ${resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    // Create message object
    const message: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Load existing messages, add new one, save
    const messages = await loadMessages();
    messages.push(message);
    await saveMessages(messages);

    console.log(`New contact message from ${message.email}:`, message.subject);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        messageId: message.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve messages (admin only)
export async function GET(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');

  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const messages = await loadMessages();
  return NextResponse.json({
    total: messages.length,
    unread: messages.filter((m: any) => !m.read).length,
    messages,
  });
}

// Export for testing and admin dashboard
async function getStoredMessages() {
  return await loadMessages();
}
