/**
 * API Documentation and Schema endpoint
 * GET /api/docs - Get API documentation
 * GET /api/docs/openapi - Get OpenAPI/Swagger schema
 */

import { NextRequest, NextResponse } from 'next/server';

interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  auth?: boolean;
  rateLimit?: string;
  params?: Record<string, any>;
  responses?: Record<number, any>;
}

const API_ENDPOINTS: APIEndpoint[] = [
  // Auth endpoints
  {
    path: '/api/auth',
    method: 'POST',
    description: 'Login or signup user (use action parameter)',
    params: { action: 'login|signup|logout|refresh' },
  },
  {
    path: '/api/auth',
    method: 'GET',
    description: 'Get current user info',
    auth: true,
  },

  // User endpoints
  {
    path: '/api/users/:userId',
    method: 'GET',
    description: 'Get user profile',
    auth: true,
  },
  {
    path: '/api/users/:userId',
    method: 'PUT',
    description: 'Update user profile',
    auth: true,
  },

  // Content endpoints
  {
    path: '/api/content',
    method: 'GET',
    description: 'List all content',
    params: { type: 'blog|research|project' },
  },
  {
    path: '/api/content',
    method: 'PUT',
    description: 'Create or update content',
    auth: true,
    rateLimit: '10 per hour',
  },
  {
    path: '/api/content',
    method: 'DELETE',
    description: 'Delete content',
    auth: true,
  },

  // Search endpoint
  {
    path: '/api/search',
    method: 'GET',
    description: 'Full-text search',
    params: { q: 'string', type: 'blog|research|project', tags: 'string[]' },
    rateLimit: '30 per minute',
  },

  // Analytics endpoints
  {
    path: '/api/analytics',
    method: 'POST',
    description: 'Track content view or performance',
    params: { action: 'track' },
  },
  {
    path: '/api/analytics',
    method: 'GET',
    description: 'Get analytics data',
    params: { action: 'overview|top|trending|performance' },
  },

  // Import/Export endpoint
  {
    path: '/api/import-export',
    method: 'GET',
    description: 'Export content',
    auth: true,
    params: { format: 'json|csv|jsonl' },
  },
  {
    path: '/api/import-export',
    method: 'POST',
    description: 'Import content',
    auth: true,
  },

  // Webhook endpoints
  {
    path: '/api/webhooks',
    method: 'POST',
    description: 'Create webhook',
    auth: true,
    rateLimit: '100 per minute',
  },
  {
    path: '/api/webhooks',
    method: 'GET',
    description: 'List webhooks',
    auth: true,
    params: { action: 'logs|test' },
  },
  {
    path: '/api/webhooks/:id',
    method: 'PUT',
    description: 'Update webhook',
    auth: true,
  },
  {
    path: '/api/webhooks/:id',
    method: 'DELETE',
    description: 'Delete webhook',
    auth: true,
  },
];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';

  if (format === 'openapi') {
    return getOpenAPISchema();
  }

  // Default: Return API documentation
  const docs = {
    title: 'Portfolio API',
    version: '1.0.0',
    description: 'REST API for portfolio content management, analytics, and user accounts',
    baseUrl: 'https://portfolio.example.com/api',
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      cookieName: 'auth-token',
    },
    rateLimiting: {
      enabled: true,
      strategy: 'per-IP, per-user, per-endpoint',
      headers: {
        'RateLimit-Limit': 'Maximum requests in window',
        'RateLimit-Remaining': 'Remaining requests',
        'RateLimit-Reset': 'Unix timestamp of reset',
      },
    },
    endpoints: API_ENDPOINTS,
    webhookEvents: [
      'content.created',
      'content.updated',
      'content.deleted',
      'user.registered',
      'user.updated',
      'comment.created',
      'comment.deleted',
      'analytics.event',
    ],
    errorHandling: {
      format: 'JSON with success flag and error message',
      httpStatus: 'Standard HTTP status codes',
      validation: 'Zod schema validation with detailed error messages',
    },
  };

  return NextResponse.json(docs, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function getOpenAPISchema() {
  const openapi = {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'REST API for portfolio content management and user accounts',
    },
    servers: [
      {
        url: 'https://portfolio.example.com/api',
        description: 'Production',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin', 'contributor'] },
            avatar: { type: 'string' },
            bio: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Content: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['blog', 'research', 'project'] },
            slug: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            featured: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time' },
          },
        },
        Webhook: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            url: { type: 'string' },
            events: { type: 'array', items: { type: 'string' } },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/auth': {
        post: {
          summary: 'Authenticate user',
          parameters: [
            {
              name: 'action',
              in: 'query',
              required: true,
              schema: { type: 'string', enum: ['login', 'signup', 'logout', 'refresh'] },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      user: { $ref: '#/components/schemas/User' },
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openapi, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
