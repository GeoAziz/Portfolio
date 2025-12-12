/**
 * Rate limiting and request throttling
 * Supports per-IP, per-user, and per-endpoint rate limiting
 */

import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export interface RateLimitStore {
  [key: string]: Array<{
    timestamp: number;
  }>;
}

// In-memory rate limit stores (in production, use Redis)
const ipRateLimits: RateLimitStore = {};
const userRateLimits: RateLimitStore = {};
const endpointRateLimits: RateLimitStore = {};

// Default rate limit configs
export const rateLimitConfigs = {
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 requests per hour
  search: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 uploads per hour
  webhook: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 webhooks per minute
};

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  return ip.trim();
}

/**
 * Check rate limit for IP address
 */
export function checkIPRateLimit(
  ip: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Initialize or get existing records
  if (!ipRateLimits[ip]) {
    ipRateLimits[ip] = [];
  }

  // Remove expired entries
  ipRateLimits[ip] = ipRateLimits[ip].filter((entry) => entry.timestamp > windowStart);

  const remaining = config.maxRequests - ipRateLimits[ip].length;
  const limited = remaining <= 0;
  const resetTime = ipRateLimits[ip].length > 0
    ? ipRateLimits[ip][0].timestamp + config.windowMs
    : now + config.windowMs;

  if (!limited) {
    ipRateLimits[ip].push({ timestamp: now });
  }

  return {
    limited,
    remaining: Math.max(0, remaining),
    resetTime,
  };
}

/**
 * Check rate limit for authenticated user
 */
export function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  if (!userRateLimits[userId]) {
    userRateLimits[userId] = [];
  }

  userRateLimits[userId] = userRateLimits[userId].filter((entry) => entry.timestamp > windowStart);

  const remaining = config.maxRequests - userRateLimits[userId].length;
  const limited = remaining <= 0;
  const resetTime = userRateLimits[userId].length > 0
    ? userRateLimits[userId][0].timestamp + config.windowMs
    : now + config.windowMs;

  if (!limited) {
    userRateLimits[userId].push({ timestamp: now });
  }

  return {
    limited,
    remaining: Math.max(0, remaining),
    resetTime,
  };
}

/**
 * Check rate limit per endpoint
 */
export function checkEndpointRateLimit(
  endpoint: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  if (!endpointRateLimits[endpoint]) {
    endpointRateLimits[endpoint] = [];
  }

  endpointRateLimits[endpoint] = endpointRateLimits[endpoint].filter(
    (entry) => entry.timestamp > windowStart
  );

  const remaining = config.maxRequests - endpointRateLimits[endpoint].length;
  const limited = remaining <= 0;
  const resetTime = endpointRateLimits[endpoint].length > 0
    ? endpointRateLimits[endpoint][0].timestamp + config.windowMs
    : now + config.windowMs;

  if (!limited) {
    endpointRateLimits[endpoint].push({ timestamp: now });
  }

  return {
    limited,
    remaining: Math.max(0, remaining),
    resetTime,
  };
}

/**
 * Reset all rate limits (useful for testing)
 */
export function resetAllRateLimits(): void {
  Object.keys(ipRateLimits).forEach((key) => delete ipRateLimits[key]);
  Object.keys(userRateLimits).forEach((key) => delete userRateLimits[key]);
  Object.keys(endpointRateLimits).forEach((key) => delete endpointRateLimits[key]);
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(limit: {
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  const resetDate = new Date(limit.resetTime);
  return {
    'X-RateLimit-Remaining': limit.remaining.toString(),
    'X-RateLimit-Reset': resetDate.toUTCString(),
  };
}
