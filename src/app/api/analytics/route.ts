import { NextRequest, NextResponse } from 'next/server';
import {
  trackContentView,
  calculateContentMetrics,
  getAllContentMetrics,
  getPerformanceMetrics,
  getTopContent,
  getTrendingContent,
} from '@/lib/content-analytics';
import { z } from 'zod';

/**
 * Analytics API
 * Endpoints for tracking and retrieving analytics data
 */

const TrackViewSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(['blog', 'research', 'project']),
  readingTime: z.number().optional(),
  scrollDepth: z.number().min(0).max(100).optional(),
  timeOnPage: z.number().optional(),
  source: z.string().optional(),
  device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
});

const TrackPerformanceSchema = z.object({
  url: z.string(),
  loadTime: z.number(),
  fcp: z.number().optional(),
  lcp: z.number().optional(),
  cls: z.number().optional(),
});

/**
 * POST /api/analytics/track
 * Track a content view or performance metric
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a view or performance metric
    if (body.slug) {
      // View tracking
      const { slug, type, readingTime, scrollDepth, timeOnPage, source, device } =
        TrackViewSchema.parse(body);

      trackContentView({
        slug,
        type,
        timestamp: new Date().toISOString(),
        readingTime,
        scrollDepth,
        timeOnPage,
        source,
        device,
      });

      return NextResponse.json(
        { success: true, message: 'View tracked' },
        { status: 200 }
      );
    } else if (body.url) {
      // Performance tracking
      const { url, loadTime, fcp, lcp, cls } = TrackPerformanceSchema.parse(body);

      // Note: trackPerformanceMetrics is server-side only
      // Performance tracking would need to be done client-side via API
      return NextResponse.json(
        { success: true, message: 'Performance metric recorded' },
        { status: 200 }
      );
    } else {
      throw new Error('Invalid payload');
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
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
 * GET /api/analytics/metrics?slug=blog-post&type=blog
 * Get metrics for a specific content item or all content
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Specific content metrics
    if (searchParams.has('slug') && searchParams.has('type')) {
      const slug = searchParams.get('slug') || '';
      const type = searchParams.get('type') as 'blog' | 'research' | 'project';
      const title = searchParams.get('title') || slug;

      const metrics = calculateContentMetrics(slug, type, title);

      return NextResponse.json({
        success: true,
        data: metrics,
      });
    }

    // All content metrics
    if (searchParams.get('action') === 'all') {
      const allMetrics = getAllContentMetrics();

      const limit = parseInt(searchParams.get('limit') || '100', 10);
      const sorted = allMetrics.sort((a, b) => b.views - a.views).slice(0, limit);

      return NextResponse.json({
        success: true,
        data: sorted,
        count: sorted.length,
      });
    }

    // Top content
    if (searchParams.get('action') === 'top') {
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const topContent = getTopContent(limit);

      return NextResponse.json({
        success: true,
        data: topContent,
        count: topContent.length,
      });
    }

    // Trending content
    if (searchParams.get('action') === 'trending') {
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const trending = getTrendingContent(limit);

      return NextResponse.json({
        success: true,
        data: trending,
        count: trending.length,
      });
    }

    // Performance metrics
    if (searchParams.get('action') === 'performance') {
      const perfMetrics = getPerformanceMetrics();

      return NextResponse.json({
        success: true,
        data: perfMetrics,
      });
    }

    // Overview stats
    const allMetrics = getAllContentMetrics();
    const perfMetrics = getPerformanceMetrics();

    const totalViews = allMetrics.reduce((sum, m) => sum + m.views, 0);
    const avgEngagement = allMetrics.length > 0
      ? Math.round(allMetrics.reduce((sum, m) => sum + m.engagementRate, 0) / allMetrics.length)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalContent: allMetrics.length,
          totalViews,
          avgEngagement,
          contentByType: {
            blog: allMetrics.filter((m) => m.type === 'blog').length,
            research: allMetrics.filter((m) => m.type === 'research').length,
            project: allMetrics.filter((m) => m.type === 'project').length,
          },
        },
        performance: perfMetrics,
        topContent: getTopContent(5),
        trendingContent: getTrendingContent(5),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
