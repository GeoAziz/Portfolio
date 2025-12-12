/**
 * Chat API Route
 * 
 * Handles AI chat requests using OpenAI API
 */

import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt: string;
  model: string;
  temperature: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request
    const body: ChatRequest = await request.json();

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Build messages with system prompt
    const messages = [
      {
        role: 'system' as const,
        content: body.systemPrompt,
      },
      ...body.messages.slice(-10), // Keep only recent messages to avoid token limits
    ];

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: body.model || 'gpt-4-turbo',
        messages,
        temperature: body.temperature || 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);

      // Handle specific errors
      if (error.error?.type === 'invalid_request_error') {
        return NextResponse.json(
          { error: 'Invalid request to AI API' },
          { status: 400 }
        );
      }

      if (error.error?.type === 'rate_limit_error') {
        return NextResponse.json(
          { error: 'Rate limited by AI API. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.error?.type === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid API configuration' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'AI API error. Please try again.' },
        { status: 500 }
      );
    }

    // Parse response
    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json(
        { error: 'No response from AI API' },
        { status: 500 }
      );
    }

    const content = data.choices[0].message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from AI API' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      content,
      model: data.model,
      usage: {
        prompt_tokens: data.usage?.prompt_tokens,
        completion_tokens: data.usage?.completion_tokens,
        total_tokens: data.usage?.total_tokens,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('fetch')) {
      return NextResponse.json(
        { error: 'Failed to connect to AI API' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  );
}
