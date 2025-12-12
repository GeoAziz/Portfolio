/**
 * Analytics Configuration and Utilities
 * 
 * Integrates Vercel Analytics for tracking page views,
 * events, and user behavior across the portfolio.
 */

import { useEffect } from 'react';

/**
 * Custom event tracking
 */
export interface TrackingEvent {
  name: string;
  data?: Record<string, string | number | boolean>;
}

/**
 * Initialize analytics (called from layout)
 */
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Vercel Analytics is automatically initialized by the SDK
  // No additional setup needed - just import Analytics from @vercel/analytics
}

/**
 * Track custom events
 */
export function trackEvent(event: TrackingEvent) {
  if (typeof window === 'undefined') return;

  try {
    // Send to window.dataLayer (Google Analytics / GTM compatible)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, event.data);
    }

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Event]', event.name, event.data);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Track page navigation
 */
export function trackPageView(path: string) {
  trackEvent({
    name: 'page_view',
    data: {
      page_path: path,
      page_title: document.title,
    },
  });
}

/**
 * Track component interactions
 */
export function trackInteraction(componentName: string, action: string) {
  trackEvent({
    name: 'component_interaction',
    data: {
      component: componentName,
      action,
    },
  });
}

/**
 * Track project clicks
 */
export function trackProjectClick(projectName: string, projectId: string) {
  trackEvent({
    name: 'project_click',
    data: {
      project_name: projectName,
      project_id: projectId,
    },
  });
}

/**
 * Track blog post views
 */
export function trackBlogView(postTitle: string, postSlug: string) {
  trackEvent({
    name: 'blog_view',
    data: {
      post_title: postTitle,
      post_slug: postSlug,
    },
  });
}

/**
 * Track chat interactions
 */
export function trackChatMessage(messageCount: number) {
  trackEvent({
    name: 'chat_message',
    data: {
      message_count: messageCount,
    },
  });
}

/**
 * Track search queries
 */
export function trackSearch(query: string, resultCount: number) {
  trackEvent({
    name: 'search_query',
    data: {
      search_query: query,
      result_count: resultCount,
    },
  });
}

/**
 * Track 3D model interactions
 */
export function track3DInteraction(modelName: string, action: string) {
  trackEvent({
    name: '3d_interaction',
    data: {
      model_name: modelName,
      action,
    },
  });
}

/**
 * Track theme changes
 */
export function trackThemeChange(theme: 'light' | 'dark' | 'system') {
  trackEvent({
    name: 'theme_change',
    data: {
      theme,
    },
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, label?: string) {
  trackEvent({
    name: 'external_link_click',
    data: {
      url,
      label: label || new URL(url).hostname,
    },
  });
}

/**
 * Performance metrics tracking
 */
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
}

/**
 * Track Web Vitals
 */
export function trackWebVitals(metrics: PerformanceMetrics) {
  Object.entries(metrics).forEach(([key, value]) => {
    if (value !== undefined) {
      trackEvent({
        name: `web_vital_${key}`,
        data: {
          value: Math.round(value),
        },
      });
    }
  });
}

/**
 * Hook for tracking page views with Next.js router
 */
export function useAnalyticsPageView(pathname: string) {
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);
}

/**
 * Goals/Conversions tracking
 */
export const Goals = {
  CHAT_SENT: 'goal_chat_sent',
  PROJECT_VISITED: 'goal_project_visited',
  RESUME_DOWNLOADED: 'goal_resume_downloaded',
  CONTACT_CLICKED: 'goal_contact_clicked',
  SEARCH_USED: 'goal_search_used',
} as const;

/**
 * Track goals
 */
export function trackGoal(goal: typeof Goals[keyof typeof Goals], data?: Record<string, any>) {
  trackEvent({
    name: goal,
    data,
  });
}
