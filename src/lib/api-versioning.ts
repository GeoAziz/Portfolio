/**
 * API versioning and backwards compatibility
 * Supports multiple API versions with migration paths
 */

import { NextRequest, NextResponse } from 'next/server';

export type APIVersion = 'v1' | 'v2' | 'v3';

export const CURRENT_API_VERSION: APIVersion = 'v1';
export const SUPPORTED_VERSIONS: APIVersion[] = ['v1'];

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  version: APIVersion;
  timestamp: string;
  metadata?: {
    requestId: string;
    processingTime: number;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  version: APIVersion;
  timestamp: string;
}

/**
 * Extract API version from request
 */
export function extractAPIVersion(request: NextRequest): APIVersion {
  // Check Accept header
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader?.includes('application/vnd.portfolio.v2+json')) {
    return 'v2';
  }
  if (acceptHeader?.includes('application/vnd.portfolio.v3+json')) {
    return 'v3';
  }

  // Check X-API-Version header
  const versionHeader = request.headers.get('x-api-version');
  if (versionHeader === 'v2' || versionHeader === 'v3') {
    return versionHeader;
  }

  // Check URL path
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('/api/v2/')) return 'v2';
  if (pathname.includes('/api/v3/')) return 'v3';

  return CURRENT_API_VERSION;
}

/**
 * Validate API version
 */
export function isVersionSupported(version: APIVersion): boolean {
  return SUPPORTED_VERSIONS.includes(version);
}

/**
 * Create API response
 */
export function createAPIResponse<T>(
  success: boolean,
  version: APIVersion,
  options: {
    data?: T;
    error?: string;
    requestId?: string;
    startTime?: number;
  } = {}
): APIResponse<T> {
  const processingTime = options.startTime ? Date.now() - options.startTime : 0;

  return {
    success,
    ...(success && options.data !== undefined && { data: options.data }),
    ...(success === false && options.error && { error: options.error }),
    version,
    timestamp: new Date().toISOString(),
    metadata: {
      requestId: options.requestId || generateRequestId(),
      processingTime,
    },
  };
}

/**
 * Create API error response
 */
export function createAPIError(
  code: string,
  message: string,
  version: APIVersion,
  details?: Record<string, any>
): APIError {
  return {
    code,
    message,
    details,
    version,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Transform response for API version
 * Handles backwards compatibility between versions
 */
export function transformResponseForVersion<T>(
  data: T,
  fromVersion: APIVersion,
  toVersion: APIVersion
): T {
  // If no transformation needed
  if (fromVersion === toVersion) return data;

  // Add version-specific transformations here
  // Example: v1 to v2 might add new fields or restructure
  if (fromVersion === 'v1' && toVersion === 'v2') {
    // Transform data for v2 API
  }

  return data;
}

/**
 * Validate request for API version
 */
export function validateAPIRequest(
  body: Record<string, any>,
  schema: Record<string, any>,
  version: APIVersion
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [key, type] of Object.entries(schema)) {
    if (body[key] === undefined && type.required) {
      errors.push(`Missing required field: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Deprecation notice for API endpoints
 */
export function getDeprecationNotice(version: APIVersion): string | null {
  const notices: Record<APIVersion, string | null> = {
    v1: null,
    v2: 'API v2 is deprecated. Please migrate to v3.',
    v3: null,
  };

  return notices[version];
}

/**
 * Get API documentation URL for version
 */
export function getAPIDocumentationUrl(version: APIVersion): string {
  return `/docs/api/${version}`;
}
