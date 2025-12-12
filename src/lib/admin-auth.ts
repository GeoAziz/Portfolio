import { headers } from 'next/headers';

/**
 * Admin authentication middleware
 * Validates admin token from request headers or cookies
 * Uses environment variable ADMIN_TOKEN for verification
 */

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-token-change-in-production';

export interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
  error?: string;
}

/**
 * Verify admin authentication
 * Checks both Authorization header and admin_token cookie
 */
export async function verifyAdminAuth(): Promise<AuthResult> {
  try {
    const headersList = await headers();
    
    // Check Authorization header
    const authHeader = headersList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === ADMIN_TOKEN) {
        return {
          isAuthenticated: true,
          userId: 'admin',
        };
      }
    }
    
    // Check X-Admin-Token header (for development)
    const adminToken = headersList.get('x-admin-token');
    if (adminToken === ADMIN_TOKEN) {
      return {
        isAuthenticated: true,
        userId: 'admin',
      };
    }
    
    // Check admin_token cookie
    const cookieHeader = headersList.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith('admin_token=')) {
          const token = cookie.substring(12);
          if (token === ADMIN_TOKEN) {
            return {
              isAuthenticated: true,
              userId: 'admin',
            };
          }
        }
      }
    }
    
    return {
      isAuthenticated: false,
      error: 'Invalid or missing admin token',
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Create an admin auth response for JSON APIs
 */
export function createAuthErrorResponse(message = 'Unauthorized') {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      message,
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
