import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { exportContent, importContent, getContentStats, bulkDelete } from '@/lib/content-import-export';
import { z } from 'zod';

/**
 * Import/Export API
 * GET - Export content in various formats
 * POST - Import content from files
 * DELETE - Bulk delete operations
 */

const ExportSchema = z.object({
  types: z.array(z.enum(['blog', 'research', 'project'])),
  format: z.enum(['json', 'csv', 'jsonl']).default('json'),
  includeMetadata: z.boolean().default(true),
});

const ImportSchema = z.object({
  data: z.string(),
  format: z.enum(['json']).default('json'),
});

const BulkDeleteSchema = z.object({
  type: z.enum(['blog', 'research', 'project']).optional(),
  slugs: z.array(z.string()).optional(),
  olderThan: z.string().datetime().optional(),
  confirm: z.boolean().default(false),
});

/**
 * GET /api/import-export?action=export&types=blog,research&format=json
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'stats') {
    try {
      const stats = getContentStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get stats',
        },
        { status: 500 }
      );
    }
  }

  if (action === 'export') {
    // Verify auth for export
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const types = (searchParams.get('types') || 'blog,research,project')
        .split(',')
        .filter((t) => ['blog', 'research', 'project'].includes(t)) as (
        | 'blog'
        | 'research'
        | 'project'
      )[];

      const format = (searchParams.get('format') || 'json') as 'json' | 'csv' | 'jsonl';

      const result = exportContent({
        types,
        format,
        includeMetadata: searchParams.get('includeMetadata') !== 'false',
      });

      // Determine content type
      const contentTypes: Record<string, string> = {
        json: 'application/json',
        csv: 'text/csv',
        jsonl: 'application/x-jsonl',
      };

      // Determine file extension
      const extensions: Record<string, string> = {
        json: '.json',
        csv: '.csv',
        jsonl: '.jsonl',
      };

      return new NextResponse(result, {
        headers: {
          'Content-Type': contentTypes[format],
          'Content-Disposition': `attachment; filename="content-export${extensions[format]}"`,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Export failed',
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

/**
 * POST /api/import-export
 * Import content from JSON
 */
export async function POST(request: NextRequest) {
  // Verify admin auth
  const auth = await verifyAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { data } = ImportSchema.parse(body);

    const result = importContent(data);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Import failed',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/import-export
 * Bulk delete operations
 */
export async function DELETE(request: NextRequest) {
  // Verify admin auth
  const auth = await verifyAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const deleteOpts = BulkDeleteSchema.parse(body);

    if (!deleteOpts.confirm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deletion not confirmed. Set confirm: true to proceed.',
        },
        { status: 400 }
      );
    }

    const result = bulkDelete({
      type: deleteOpts.type,
      slugs: deleteOpts.slugs,
      olderThan: deleteOpts.olderThan ? new Date(deleteOpts.olderThan) : undefined,
      confirm: deleteOpts.confirm,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Delete failed',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
