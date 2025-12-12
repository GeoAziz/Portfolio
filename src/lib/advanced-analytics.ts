/**
 * Advanced Analytics Data Models
 * User journey tracking, heatmaps, session recording, and performance metrics
 */

export interface AnalyticsEvent {
  id: string;
  userId: string;
  sessionId: string;
  type: 'pageview' | 'click' | 'scroll' | 'form' | 'error' | 'conversion';
  page: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  referrer?: string;
  conversionGoal?: string;
  conversionValue?: number;
}

export interface PageMetrics {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topEvents: Array<{
    type: string;
    count: number;
  }>;
}

export interface HeatmapData {
  page: string;
  x: number;
  y: number;
  clicks: number;
  scrollDepth?: number;
}

export interface PerformanceMetrics {
  page: string;
  timestamp: number;
  // Core Web Vitals
  LCP: number; // Largest Contentful Paint (ms)
  FID: number; // First Input Delay (ms)
  CLS: number; // Cumulative Layout Shift (0-1)
  // Additional metrics
  FCP: number; // First Contentful Paint (ms)
  TTFB: number; // Time to First Byte (ms)
  DNS: number; // DNS lookup (ms)
  TCP: number; // TCP connection (ms)
  SSL: number; // SSL negotiation (ms)
  request: number; // Request time (ms)
  render: number; // Rendering time (ms)
  domInteractive: number; // DOM ready (ms)
  domComplete: number; // DOM complete (ms)
}

export interface ConversionEvent {
  id: string;
  userId: string;
  sessionId: string;
  type: 'signup' | 'newsletter' | 'contact' | 'download' | 'purchase' | 'custom';
  name: string;
  value: number;
  timestamp: number;
  page: string;
  source?: string;
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  startPage: string;
  endPage: string;
  pages: string[];
  totalDuration: number;
  eventCount: number;
  converted: boolean;
  conversionType?: string;
  conversionTime?: number;
}

export interface CohortData {
  cohortDate: string;
  cohortSize: number;
  retentionByWeek: number[];
  activationRate: number;
  engagementRate: number;
}

/**
 * Generate mock analytics data for demonstration
 */
export function generateMockAnalyticsData(days: number = 7) {
  const now = Date.now();
  const sessions: UserSession[] = [];
  const events: AnalyticsEvent[] = [];
  const pageMetrics: Record<string, PageMetrics> = {};

  const pages = ['/', '/projects', '/blog', '/ai', '/newsletter'];
  const eventTypes: AnalyticsEvent['type'][] = ['pageview', 'click', 'scroll', 'form', 'conversion'];

  for (let i = 0; i < days; i++) {
    const dayStart = now - i * 24 * 60 * 60 * 1000;

    // Generate 5-15 sessions per day
    const sessionsPerDay = Math.floor(Math.random() * 10) + 5;

    for (let j = 0; j < sessionsPerDay; j++) {
      const sessionId = `session-${i}-${j}`;
      const sessionStart = dayStart - Math.random() * 24 * 60 * 60 * 1000;
      const sessionDuration = Math.floor(Math.random() * 30 * 60 * 1000) + 60000; // 1-30 minutes

      const deviceTypes: Array<'mobile' | 'tablet' | 'desktop'> = ['mobile', 'tablet', 'desktop'];
      const oses = ['iOS', 'Android', 'Windows', 'macOS'];
      const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

      const session: UserSession = {
        id: sessionId,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        startTime: sessionStart,
        endTime: sessionStart + sessionDuration,
        duration: sessionDuration,
        pageViews: Math.floor(Math.random() * 5) + 1,
        events: [],
        device: {
          type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
          os: oses[Math.floor(Math.random() * oses.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
        },
      };

      // Generate events for this session
      const eventCount = Math.floor(Math.random() * 10) + 2;
      for (let k = 0; k < eventCount; k++) {
        const event: AnalyticsEvent = {
          id: `event-${i}-${j}-${k}`,
          userId: session.userId,
          sessionId,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          page: pages[Math.floor(Math.random() * pages.length)],
          timestamp: sessionStart + Math.random() * sessionDuration,
          metadata: {
            scrollDepth: Math.random() * 100,
            clickX: Math.random() * 1200,
            clickY: Math.random() * 800,
          },
        };
        events.push(event);
        session.events.push(event);
      }

      sessions.push(session);
    }
  }

  // Aggregate page metrics
  for (const event of events) {
    if (!pageMetrics[event.page]) {
      pageMetrics[event.page] = {
        page: event.page,
        views: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        topEvents: [],
      };
    }

    const metrics = pageMetrics[event.page];
    metrics.views++;
  }

  // Convert to array
  const metricsArray = Object.values(pageMetrics).map((m) => ({
    ...m,
    uniqueVisitors: Math.floor(m.views * (0.5 + Math.random() * 0.5)), // Mock unique visitors
  }));

  return {
    sessions,
    events,
    pageMetrics: metricsArray,
  };
}

/**
 * Calculate user journey from events
 */
export function calculateUserJourneys(events: AnalyticsEvent[], sessions: UserSession[]): UserJourney[] {
  const journeys: UserJourney[] = [];
  const sessionMap = new Map(sessions.map((s) => [s.id, s]));

  for (const session of sessions) {
    const pageSequence: string[] = [];
    const sessionEvents = events.filter((e) => e.sessionId === session.id).sort((a, b) => a.timestamp - b.timestamp);

    // Extract unique page sequence
    for (const event of sessionEvents) {
      if (event.type === 'pageview' && !pageSequence.includes(event.page)) {
        pageSequence.push(event.page);
      }
    }

    const journey: UserJourney = {
      userId: session.userId,
      sessionId: session.id,
      startPage: pageSequence[0] || 'unknown',
      endPage: pageSequence[pageSequence.length - 1] || 'unknown',
      pages: pageSequence,
      totalDuration: session.duration || 0,
      eventCount: sessionEvents.length,
      converted: sessionEvents.some((e) => e.type === 'conversion'),
      conversionType: sessionEvents.find((e) => e.type === 'conversion')?.metadata?.type,
      conversionTime: sessionEvents.find((e) => e.type === 'conversion')?.timestamp,
    };

    journeys.push(journey);
  }

  return journeys;
}

/**
 * Calculate retention cohorts
 */
export function calculateCohorts(sessions: UserSession[]): CohortData[] {
  const cohortMap = new Map<string, Set<string>>();
  const cohorts: CohortData[] = [];

  for (const session of sessions) {
    const cohortDate = new Date(session.startTime).toISOString().split('T')[0];

    if (!cohortMap.has(cohortDate)) {
      cohortMap.set(cohortDate, new Set());
    }

    cohortMap.get(cohortDate)!.add(session.userId);
  }

  for (const [date, users] of cohortMap) {
    cohorts.push({
      cohortDate: date,
      cohortSize: users.size,
      retentionByWeek: [100, 85, 72, 60, 50], // Mock data
      activationRate: Math.random() * 100,
      engagementRate: Math.random() * 100,
    });
  }

  return cohorts.sort((a, b) => a.cohortDate.localeCompare(b.cohortDate));
}

/**
 * Calculate performance metrics from Web Vitals
 */
export function calculatePerformanceMetrics(navigationTiming: PerformanceTiming, pageUrl: string): PerformanceMetrics {
  const now = performance.now();

  return {
    page: pageUrl,
    timestamp: Date.now(),
    // Estimated metrics (would come from actual Web Vitals library)
    LCP: navigationTiming.loadEventEnd - navigationTiming.navigationStart,
    FID: Math.random() * 100,
    CLS: Math.random() * 0.5,
    FCP: navigationTiming.domContentLoadedEventStart - navigationTiming.navigationStart,
    TTFB: navigationTiming.responseStart - navigationTiming.navigationStart,
    DNS: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
    TCP: navigationTiming.connectEnd - navigationTiming.connectStart,
    SSL: navigationTiming.secureConnectionStart
      ? navigationTiming.connectEnd - navigationTiming.secureConnectionStart
      : 0,
    request: navigationTiming.responseStart - navigationTiming.requestStart,
    render: navigationTiming.domInteractive - navigationTiming.domLoading,
    domInteractive: navigationTiming.domInteractive - navigationTiming.navigationStart,
    domComplete: navigationTiming.domComplete - navigationTiming.navigationStart,
  };
}
