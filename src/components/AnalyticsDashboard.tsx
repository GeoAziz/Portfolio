'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, Zap, Lock } from 'lucide-react';

interface Analytics {
  overview?: {
    totalContent: number;
    totalViews: number;
    avgEngagement: number;
    contentByType: Record<string, number>;
  };
  performance?: Record<string, any>;
  topContent?: any[];
  trendingContent?: any[];
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = (token: string) => {
    setAdminToken(token);
    setAuthenticated(!!token);
    loadAnalytics(token);
  };

  const loadAnalytics = async (token?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics', {
        headers: token ? { 'X-Admin-Token': token } : {},
      });
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load public analytics
    loadAnalytics();
  }, []);

  if (!analytics && loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Authentication Section */}
      {!authenticated && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Enhanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your admin token to view detailed analytics and performance metrics.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Admin Token (optional)"
                value={adminToken}
                onChange={e => handleAuth(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      {analytics?.overview && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-3xl font-bold text-foreground">{analytics.overview.totalContent}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Total Views
                </p>
                <p className="text-3xl font-bold text-foreground">{analytics.overview.totalViews}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Avg Engagement
                </p>
                <p className="text-3xl font-bold text-foreground">{analytics.overview.avgEngagement}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Content by Type</p>
                <div className="space-y-1 mt-3">
                  <p className="text-xs">
                    Blog: <span className="font-bold">{analytics.overview.contentByType.blog}</span>
                  </p>
                  <p className="text-xs">
                    Research: <span className="font-bold">{analytics.overview.contentByType.research}</span>
                  </p>
                  <p className="text-xs">
                    Projects: <span className="font-bold">{analytics.overview.contentByType.project}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {analytics?.performance && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance Metrics (Last 24h)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Load Time</p>
                  <p className="text-3xl font-bold text-foreground">
                    {analytics.performance.avgLoadTime || 0}
                    <span className="text-sm text-muted-foreground ml-1">ms</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Page Loads</p>
                  <p className="text-3xl font-bold text-foreground">
                    {analytics.performance.recentPageLoads || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Top Content */}
      {analytics?.topContent && analytics.topContent.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top Content
          </h2>
          <div className="space-y-2">
            {analytics.topContent.map((item, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">{item.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Trending Content */}
      {analytics?.trendingContent && analytics.trendingContent.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trending This Week
          </h2>
          <div className="space-y-2">
            {analytics.trendingContent.map((item, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        +{item.viewsLastWeek}
                      </p>
                      <p className="text-xs text-muted-foreground">this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
