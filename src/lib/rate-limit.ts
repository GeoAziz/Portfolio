/**
 * Rate limiting utility for API endpoints
 * Supports in-memory rate limiting with configurable limits per endpoint
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting
const store: RateLimitStore = {};

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

const ENDPOINT_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints - stricter limits
  '/api/auth': {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
  },
  // Search endpoint
  '/api/search': {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
  // Analytics endpoint
  '/api/analytics': {
    maxRequests: 1000,
    windowMs: 60 * 1000, // 1000 requests per minute
  },
  // Content API
  '/api/content': {
    maxRequests: 50,
    windowMs: 60 * 1000, // 50 requests per minute
  },
  // General API default
  '/api': {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
};

/**
 * Get rate limit config for an endpoint
 */
function getConfig(path: string): RateLimitConfig {
  // Find most specific matching endpoint
  for (const [endpoint, config] of Object.entries(ENDPOINT_LIMITS)) {
    if (path.startsWith(endpoint)) {
      return config;
    }
  }
  return DEFAULT_CONFIG;
}

/**
 * Create a unique key for rate limiting (IP + endpoint)
 */
export function createRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(key: string, config?: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
} {
  const now = Date.now();
  const limitConfig = config || DEFAULT_CONFIG;

  // Initialize or reset if window expired
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + limitConfig.windowMs,
    };
  }

  // Increment request count
  store[key].count += 1;

  const allowed = store[key].count <= limitConfig.maxRequests;
  const remaining = Math.max(0, limitConfig.maxRequests - store[key].count);
  const resetAt = new Date(store[key].resetTime);

  return { allowed, remaining, resetAt };
}

/**
 * Rate limit middleware for Next.js API routes
 */
export async function applyRateLimit(
  request: Request,
  endpoint: string
): Promise<{
  allowed: boolean;
  headers: Record<string, string>;
}> {
  // Get client IP
  const ip = getClientIp(request);
  const key = createRateLimitKey(ip, endpoint);

  // Get rate limit config for this endpoint
  const config = getConfig(endpoint);

  // Check rate limit
  const result = checkRateLimit(key, config);

  // Create rate limit headers
  const headers = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
  };

  return {
    allowed: result.allowed,
    headers,
  };
}

/**
 * Extract client IP from request
 */
function getClientIp(request: Request): string {
  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'x-real-ip': request.headers.get('x-real-ip'),
  };

  // Return first non-empty header value
  for (const [, value] of Object.entries(headers)) {
    if (value) {
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

/**
 * Get rate limit stats (for monitoring)
 */
export function getRateLimitStats(): {
  totalKeys: number;
  stats: Array<{
    key: string;
    count: number;
    resetAt: string;
  }>;
} {
  const now = Date.now();
  const stats = Object.entries(store)
    .filter(([, data]) => data.resetTime > now) // Only active limits
    .map(([key, data]) => ({
      key,
      count: data.count,
      resetAt: new Date(data.resetTime).toISOString(),
    }));

  return {
    totalKeys: stats.length,
    stats,
  };
}

/**
 * Clear expired rate limit entries (cleanup)
 */
export function clearExpiredLimits() {
  const now = Date.now();
  for (const [key, data] of Object.entries(store)) {
    if (data.resetTime < now) {
      delete store[key];
    }
  }
}
