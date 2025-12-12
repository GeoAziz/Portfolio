/**
 * Newsletter Service
 * 
 * Handles newsletter subscriptions with support for:
 * - Mailchimp
 * - ConvertKit
 * - Custom backend
 */

import { validateAndSanitizeEmail } from '@/lib/email-validation';

export interface NewsletterSubscribeRequest {
  email: string;
  firstName?: string;
  source?: string; // Where they subscribed from
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Subscribe to newsletter
 * 
 * Hits /api/newsletter endpoint
 */
export async function subscribeToNewsletter(
  request: NewsletterSubscribeRequest
): Promise<NewsletterSubscribeResponse> {
  try {
    // Validate email
    const validation = validateAndSanitizeEmail(request.email);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || 'Invalid email',
        error: validation.error,
      };
    }

    // Make request to API
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validation.email,
        firstName: request.firstName || '',
        source: request.source || 'unknown',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to subscribe',
        error: data.error || 'Unknown error',
      };
    }

    return {
      success: true,
      message: data.message || 'Successfully subscribed!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  try {
    const validation = validateAndSanitizeEmail(email);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || 'Invalid email',
        error: validation.error,
      };
    }

    const response = await fetch('/api/newsletter', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validation.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to unsubscribe',
        error: data.error || 'Unknown error',
      };
    }

    return {
      success: true,
      message: data.message || 'Successfully unsubscribed',
    };
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
