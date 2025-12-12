/**
 * API request logging and audit trail
 * Logs all API requests for debugging, analytics, and compliance
 */

import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const LOGS_DIR = path.join(process.cwd(), 'src/data/logs');

// Ensure logs directory exists
async function ensureLogsDir() {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create logs directory:', error);
  }
}

export interface APIRequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  endpoint: string;
  ip: string;
  userId?: string;
  statusCode: number;
  responseTime: number; // milliseconds
  userAgent: string;
  referer?: string;
  requestBody?: Record<string, any>;
  requestHeaders: Record<string, string>;
  responseSize: number; // bytes
  error?: string;
  apiVersion?: string;
}

export interface APIAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: Record<string, any>;
}

/**
 * Log API request
 */
export async function logAPIRequest(
  request: NextRequest,
  response: NextResponse,
  options: {
    statusCode: number;
    responseTime: number;
    responseSize: number;
    requestBody?: Record<string, any>;
    userId?: string;
    error?: string;
    apiVersion?: string;
  }
): Promise<void> {
  try {
    await ensureLogsDir();

    const ip = getClientIP(request);
    const now = new Date();
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const log: APIRequestLog = {
      id: logId,
      timestamp: now.toISOString(),
      method: request.method,
      path: request.nextUrl.pathname,
      endpoint: request.nextUrl.pathname.split('/').slice(0, 4).join('/'),
      ip,
      userId: options.userId,
      statusCode: options.statusCode,
      responseTime: options.responseTime,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || undefined,
      requestBody: options.requestBody,
      requestHeaders: extractSafeHeaders(request.headers),
      responseSize: options.responseSize,
      error: options.error,
      apiVersion: options.apiVersion,
    };

    // Determine log file based on date
    const date = now.toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `api-${date}.jsonl`);

    // Append to log file (JSONL format)
    await fs.appendFile(logFile, JSON.stringify(log) + '\n');
  } catch (error) {
    console.error('Failed to log API request:', error);
  }
}

/**
 * Log audit event (user actions)
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  resource: string,
  options: {
    resourceId?: string;
    changes?: Record<string, { old: any; new: any }>;
    ipAddress: string;
    userAgent: string;
    status?: 'success' | 'failure';
    details?: Record<string, any>;
  }
): Promise<void> {
  try {
    await ensureLogsDir();

    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const log: APIAuditLog = {
      id: auditId,
      timestamp: now.toISOString(),
      userId,
      action,
      resource,
      resourceId: options.resourceId,
      changes: options.changes || {},
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      status: options.status || 'success',
      details: options.details,
    };

    const date = now.toISOString().split('T')[0];
    const auditFile = path.join(LOGS_DIR, `audit-${date}.jsonl`);

    await fs.appendFile(auditFile, JSON.stringify(log) + '\n');
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Get logs for a specific date range
 */
export async function getLogs(
  type: 'api' | 'audit',
  startDate: Date,
  endDate: Date
): Promise<(APIRequestLog | APIAuditLog)[]> {
  try {
    await ensureLogsDir();

    const logs: (APIRequestLog | APIAuditLog)[] = [];
    const prefix = type === 'api' ? 'api-' : 'audit-';

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const logFile = path.join(LOGS_DIR, `${prefix}${dateStr}.jsonl`);

      try {
        const content = await fs.readFile(logFile, 'utf-8');
        const lines = content.trim().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            logs.push(JSON.parse(line));
          }
        }
      } catch {
        // File might not exist for this date
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return logs;
  } catch (error) {
    console.error('Failed to get logs:', error);
    return [];
  }
}

/**
 * Get API stats from logs
 */
export async function getAPIStats(days: number = 7): Promise<{
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  topErrors: Array<{ error: string; count: number }>;
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await getLogs('api', startDate, new Date());

    if (logs.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        topEndpoints: [],
        topErrors: [],
      };
    }

    const apiLogs = logs as APIRequestLog[];

    const totalRequests = apiLogs.length;
    const avgResponseTime =
      apiLogs.reduce((sum, log) => sum + log.responseTime, 0) / totalRequests;

    const errors = apiLogs.filter((log) => log.error);
    const errorRate = (errors.length / totalRequests) * 100;

    // Top endpoints
    const endpointCounts: Record<string, number> = {};
    for (const log of apiLogs) {
      endpointCounts[log.endpoint] = (endpointCounts[log.endpoint] || 0) + 1;
    }
    const topEndpoints = Object.entries(endpointCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Top errors
    const errorCounts: Record<string, number> = {};
    for (const log of errors) {
      if (log.error) {
        errorCounts[log.error] = (errorCounts[log.error] || 0) + 1;
      }
    }
    const topErrors = Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }));

    return {
      totalRequests,
      avgResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      topEndpoints,
      topErrors,
    };
  } catch (error) {
    console.error('Failed to get API stats:', error);
    return {
      totalRequests: 0,
      avgResponseTime: 0,
      errorRate: 0,
      topEndpoints: [],
      topErrors: [],
    };
  }
}

/**
 * Extract safe headers for logging (remove sensitive data)
 */
function extractSafeHeaders(headers: Headers): Record<string, string> {
  const safe: Record<string, string> = {};
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

  for (const [key, value] of headers.entries()) {
    if (!sensitiveHeaders.includes(key.toLowerCase())) {
      safe[key] = value;
    }
  }

  return safe;
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
}
