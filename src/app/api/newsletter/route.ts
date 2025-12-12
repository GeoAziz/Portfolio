/**
 * Newsletter API Endpoint
 * 
 * Handles newsletter subscriptions and unsubscriptions
 * 
 * Environment variables needed:
 * - NEWSLETTER_API_KEY: API key for the newsletter service
 * - NEWSLETTER_SERVICE: Type of service (mailchimp, convertkit, custom)
 * 
 * For Mailchimp, also need:
 * - MAILCHIMP_LIST_ID: Audience/List ID
 * - MAILCHIMP_SERVER_PREFIX: API server prefix (e.g., "us1")
 * 
 * For ConvertKit, also need:
 * - CONVERTKIT_FORM_ID: Form ID for signups
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeEmail } from '@/lib/email-validation';
import { trackGoal, Goals } from '@/lib/analytics';

interface SubscriptionRequest {
  email: string;
  firstName?: string;
  source?: string;
}

interface UnsubscribeRequest {
  email: string;
}

/**
 * Mock database to track subscriptions
 * In production, this would be a real database or service
 */
const subscribers = new Set<string>();

/**
 * Handle POST requests (subscribe)
 */
async function handleSubscribe(req: NextRequest): Promise<NextResponse> {
  try {
    const body: SubscriptionRequest = await req.json();

    // Validate email
    const validation = validateAndSanitizeEmail(body.email);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const email = validation.email!;

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json(
        { message: 'You are already subscribed', alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Add to subscribers
    subscribers.add(email);

    // TODO: Integrate with real newsletter service
    // Example implementations below:

    // Mailchimp integration
    // if (process.env.NEWSLETTER_SERVICE === 'mailchimp') {
    //   const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
    //   const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    //   const apiKey = process.env.MAILCHIMP_API_KEY;
    //
    //   const response = await fetch(
    //     `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${apiKey}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         email_address: email,
    //         status: 'subscribed',
    //         merge_fields: {
    //           FNAME: body.firstName || '',
    //         },
    //       }),
    //     }
    //   );
    //   // Handle response
    // }

    // ConvertKit integration
    // if (process.env.NEWSLETTER_SERVICE === 'convertkit') {
    //   const formId = process.env.CONVERTKIT_FORM_ID;
    //   const apiKey = process.env.CONVERTKIT_API_KEY;
    //
    //   const response = await fetch(
    //     `https://api.convertkit.com/v3/forms/${formId}/subscriptions`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         api_key: apiKey,
    //         email: email,
    //         first_name: body.firstName || '',
    //       }),
    //     }
    //   );
    //   // Handle response
    // }

    console.log(`Newsletter signup: ${email} (source: ${body.source})`);

    // Track goal
    if (typeof window === 'undefined') {
      // Server-side - can't track directly, but API call from client will
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Welcome to our newsletter! Check your email for confirmation.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Handle DELETE requests (unsubscribe)
 */
async function handleUnsubscribe(req: NextRequest): Promise<NextResponse> {
  try {
    const body: UnsubscribeRequest = await req.json();

    // Validate email
    const validation = validateAndSanitizeEmail(body.email);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const email = validation.email!;

    // Remove from subscribers
    subscribers.delete(email);

    // TODO: Integrate with real newsletter service
    // Similar to subscribe above, but with unsubscribe/delete logic

    console.log(`Newsletter unsubscribe: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'You have been unsubscribed from our newsletter.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Main route handler
 */
export async function POST(req: NextRequest) {
  return handleSubscribe(req);
}

export async function DELETE(req: NextRequest) {
  return handleUnsubscribe(req);
}
