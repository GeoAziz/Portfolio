import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics | Portfolio',
  description: 'View content analytics, performance metrics, and insights.',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Content Analytics</h1>
          <p className="text-lg text-muted-foreground">
            View content performance metrics, engagement statistics, and trends.
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
}
