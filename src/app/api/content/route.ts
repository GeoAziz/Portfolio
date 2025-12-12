import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { updateContentItem, deleteContentItem, getChangeHistory } from '@/lib/content-storage';
import { z } from 'zod';

/**
 * Content management API
 * Endpoints for editing, deleting, and viewing content history
 * All endpoints require admin authentication
 */

// Request schemas
const UpdateContentSchema = z.object({
  type: z.enum(['blog', 'research', 'project']),
  slug: z.string().min(1),
  updates: z.record(z.any()),
});

const DeleteContentSchema = z.object({
  type: z.enum(['blog', 'research', 'project']),
  slug: z.string().min(1),
});

const HistoryQuerySchema = z.object({
  type: z.enum(['blog', 'research', 'project']).optional(),
  limit: z.string().transform(Number).default('100'),
});

/**
 * PUT /api/content - Update or create content
 */
export async function PUT(request: NextRequest) {
  // Verify admin auth
  const auth = await verifyAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: auth.error,
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug, updates } = UpdateContentSchema.parse(body);

    const result = updateContentItem(type, slug, updates);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/content - Delete content
 */
export async function DELETE(request: NextRequest) {
  // Verify admin auth
  const auth = await verifyAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: auth.error,
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug } = DeleteContentSchema.parse(body);

    const result = deleteContentItem(type, slug);

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

/**
 * GET /api/content?type=blog&limit=50 - Get content change history
 */
export async function GET(request: NextRequest) {
  // Verify admin auth
  const auth = await verifyAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: auth.error,
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'blog' | 'research' | 'project' | undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const history = getChangeHistory(type, limit);

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
