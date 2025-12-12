import fs from 'fs';
import path from 'path';

/**
 * Content Analytics System
 * Tracks views, engagement, and performance metrics for content
 */

export interface ContentView {
  slug: string;
  type: 'blog' | 'research' | 'project';
  timestamp: string;
  readingTime?: number;
  scrollDepth?: number; // 0-100
  timeOnPage?: number; // seconds
  source?: string; // referrer
  userAgent?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
}

export interface ContentMetrics {
  slug: string;
  type: 'blog' | 'research' | 'project';
  title: string;
  views: number;
  avgReadingTime: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  viewsLastDay: number;
  viewsLastWeek: number;
  viewsLastMonth: number;
  engagementRate: number; // 0-100
  topReferrers: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  lastViewed?: string;
  createdAt?: string;
  updatedAt?: string;
}

const analyticsDir = path.join(process.cwd(), 'src', 'content', '.analytics');

// Ensure analytics directory exists
if (!fs.existsSync(analyticsDir)) {
  fs.mkdirSync(analyticsDir, { recursive: true });
}

/**
 * Log a content view
 */
export function trackContentView(view: ContentView): void {
  try {
    const viewsFile = path.join(analyticsDir, 'views.jsonl');
    const entry = JSON.stringify({
      ...view,
      timestamp: view.timestamp || new Date().toISOString(),
    });

    fs.appendFileSync(viewsFile, entry + '\n');
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

/**
 * Get all views for a content item
 */
export function getContentViews(slug: string, type: 'blog' | 'research' | 'project'): ContentView[] {
  try {
    const viewsFile = path.join(analyticsDir, 'views.jsonl');

    if (!fs.existsSync(viewsFile)) {
      return [];
    }

    const content = fs.readFileSync(viewsFile, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);

    return lines
      .map((line) => {
        try {
          const view = JSON.parse(line);
          return view;
        } catch {
          return null;
        }
      })
      .filter((view): view is ContentView => view !== null && view.slug === slug && view.type === type);
  } catch (error) {
    console.error('Error reading views:', error);
    return [];
  }
}

/**
 * Calculate metrics for a content item
 */
export function calculateContentMetrics(
  slug: string,
  type: 'blog' | 'research' | 'project',
  title: string,
  createdAt?: string
): ContentMetrics {
  const views = getContentViews(slug, type);
  const now = new Date();
  const oneDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const viewsLastDay = views.filter((v) => new Date(v.timestamp) > oneDay).length;
  const viewsLastWeek = views.filter((v) => new Date(v.timestamp) > oneWeek).length;
  const viewsLastMonth = views.filter((v) => new Date(v.timestamp) > oneMonth).length;

  const avgReadingTime = views.length > 0
    ? views.reduce((sum, v) => sum + (v.readingTime || 0), 0) / views.length
    : 0;

  const avgScrollDepth = views.length > 0
    ? views.reduce((sum, v) => sum + (v.scrollDepth || 0), 0) / views.length
    : 0;

  const avgTimeOnPage = views.length > 0
    ? views.reduce((sum, v) => sum + (v.timeOnPage || 0), 0) / views.length
    : 0;

  // Engagement: views with good scroll depth and time on page
  const engagedViews = views.filter((v) => (v.scrollDepth || 0) > 30 && (v.timeOnPage || 0) > 30).length;
  const engagementRate = views.length > 0 ? (engagedViews / views.length) * 100 : 0;

  // Top referrers
  const topReferrers: Record<string, number> = {};
  views.forEach((v) => {
    if (v.source) {
      topReferrers[v.source] = (topReferrers[v.source] || 0) + 1;
    }
  });

  // Device breakdown
  const deviceBreakdown: Record<string, number> = {};
  views.forEach((v) => {
    const device = v.device || 'unknown';
    deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
  });

  const lastViewed = views.length > 0 ? views[views.length - 1].timestamp : undefined;

  return {
    slug,
    type,
    title,
    views: views.length,
    avgReadingTime: Math.round(avgReadingTime),
    avgScrollDepth: Math.round(avgScrollDepth),
    avgTimeOnPage: Math.round(avgTimeOnPage),
    viewsLastDay,
    viewsLastWeek,
    viewsLastMonth,
    engagementRate: Math.round(engagementRate),
    topReferrers,
    deviceBreakdown,
    lastViewed,
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get all content metrics
 */
export function getAllContentMetrics(): ContentMetrics[] {
  try {
    const viewsFile = path.join(analyticsDir, 'views.jsonl');

    if (!fs.existsSync(viewsFile)) {
      return [];
    }

    const content = fs.readFileSync(viewsFile, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);

    const viewsByContent: Record<string, ContentView[]> = {};

    lines.forEach((line) => {
      try {
        const view = JSON.parse(line);
        const key = `${view.type}:${view.slug}`;
        if (!viewsByContent[key]) {
          viewsByContent[key] = [];
        }
        viewsByContent[key].push(view);
      } catch {
        // Skip invalid lines
      }
    });

    const metrics: ContentMetrics[] = [];
    Object.entries(viewsByContent).forEach(([key, views]) => {
      if (views.length > 0) {
        const [type, slug] = key.split(':') as [
          'blog' | 'research' | 'project',
          string
        ];
        const title = views[0].slug; // Fallback, ideally we'd have title
        metrics.push(calculateContentMetrics(slug, type, title));
      }
    });

    return metrics;
  } catch (error) {
    console.error('Error getting all metrics:', error);
    return [];
  }
}

/**
 * Get performance metrics for analytics
 */
export function getPerformanceMetrics(): Record<string, any> {
  try {
    const performanceFile = path.join(analyticsDir, 'performance.jsonl');

    if (!fs.existsSync(performanceFile)) {
      return {};
    }

    const content = fs.readFileSync(performanceFile, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);

    const metrics = lines
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const now = new Date();
    const oneDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentMetrics = metrics.filter((m) => new Date(m.timestamp) > oneDay);

    return {
      totalPageLoads: metrics.length,
      recentPageLoads: recentMetrics.length,
      avgLoadTime: recentMetrics.length > 0
        ? Math.round(recentMetrics.reduce((sum, m) => sum + (m.loadTime || 0), 0) / recentMetrics.length)
        : 0,
      avgFirstContentfulPaint: recentMetrics.length > 0
        ? Math.round(recentMetrics.reduce((sum, m) => sum + (m.fcp || 0), 0) / recentMetrics.length)
        : 0,
      avgLargestContentfulPaint: recentMetrics.length > 0
        ? Math.round(recentMetrics.reduce((sum, m) => sum + (m.lcp || 0), 0) / recentMetrics.length)
        : 0,
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return {};
  }
}

/**
 * Track page performance metrics (from browser)
 */
export function trackPerformanceMetrics(metrics: {
  url: string;
  loadTime: number;
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
}): void {
  try {
    const performanceFile = path.join(analyticsDir, 'performance.jsonl');
    const entry = JSON.stringify({
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    fs.appendFileSync(performanceFile, entry + '\n');
  } catch (error) {
    console.error('Error tracking performance:', error);
  }
}

/**
 * Get top content by views
 */
export function getTopContent(limit = 10): ContentMetrics[] {
  const allMetrics = getAllContentMetrics();
  return allMetrics.sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Get trending content (views in last week)
 */
export function getTrendingContent(limit = 10): ContentMetrics[] {
  const allMetrics = getAllContentMetrics();
  return allMetrics
    .filter((m) => m.viewsLastWeek > 0)
    .sort((a, b) => b.viewsLastWeek - a.viewsLastWeek)
    .slice(0, limit);
}

/**
 * Clear analytics data (for testing)
 */
export function clearAnalytics(): void {
  try {
    const viewsFile = path.join(analyticsDir, 'views.jsonl');
    const performanceFile = path.join(analyticsDir, 'performance.jsonl');

    if (fs.existsSync(viewsFile)) {
      fs.unlinkSync(viewsFile);
    }
    if (fs.existsSync(performanceFile)) {
      fs.unlinkSync(performanceFile);
    }
  } catch (error) {
    console.error('Error clearing analytics:', error);
  }
}
