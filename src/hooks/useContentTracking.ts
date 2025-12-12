'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook for tracking content views and engagement
 * Integrates with the analytics API
 */

export interface TrackingData {
  slug: string;
  type: 'blog' | 'research' | 'project';
  title?: string;
}

export function useContentTracking(data: TrackingData) {
  const startTimeRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    scrollRef.current = 0;

    // Detect device type
    const getDevice = (): 'mobile' | 'tablet' | 'desktop' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollDepth = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      scrollRef.current = Math.min(scrollDepth, 100);
    };

    // Track on page unload or after delay
    const trackView = async () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

      // Only track if user spent at least 3 seconds on page
      if (timeOnPage < 3) {
        return;
      }

      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: data.slug,
            type: data.type,
            timeOnPage,
            scrollDepth: Math.round(scrollRef.current),
            device: getDevice(),
            source: document.referrer || 'direct',
          }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Track view on page leave
    const handleBeforeUnload = () => {
      trackView();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also track after 30 seconds
    const timer = setTimeout(trackView, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timer);
    };
  }, [data]);
}

/**
 * Hook for tracking Web Vitals
 */
export function useWebVitalsTracking() {
  useEffect(() => {
    // Track when page is fully loaded
    const trackPerformance = () => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        try {
          // Get basic navigation timing
          const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

          if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);

            // Try to get Core Web Vitals if available (requires web-vitals library or custom implementation)
            const fcp = perfData.responseStart ? Math.round(perfData.responseStart - perfData.fetchStart) : undefined;

            fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: window.location.pathname,
                loadTime,
                fcp,
              }),
            }).catch((e) => console.error('Error tracking performance:', e));
          }
        } catch (error) {
          console.error('Error getting performance data:', error);
        }
      }
    };

    // Track once page is loaded
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    return () => {
      window.removeEventListener('load', trackPerformance);
    };
  }, []);
}
