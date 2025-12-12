/**
 * Analytics Dashboard
 * 
 * Shows analytics metrics and insights
 * Note: Real data from Vercel Analytics API requires authentication
 * This page demonstrates the analytics setup
 */

'use client';

import { SectionHeader } from '@/components/SectionHeader';
import { PageTransition } from '@/components/PageTransition';

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageTransition>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionHeader title="Analytics Dashboard" />
          <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
            Portfolio metrics and user engagement tracking
          </p>

          <div className="mt-12 space-y-8">
            {/* Analytics Setup Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📊 Analytics Setup</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Vercel Analytics integrated and initialized</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Automatic page view tracking on all routes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Custom event tracking for interactions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Goals/conversion tracking system</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Performance metrics collection</span>
                </li>
              </ul>
            </div>

            {/* Tracked Events */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📈 Tracked Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">page_view</p>
                  <p className="text-xs text-slate-400 mt-2">Every page visit</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">component_interaction</p>
                  <p className="text-xs text-slate-400 mt-2">UI interactions</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">project_click</p>
                  <p className="text-xs text-slate-400 mt-2">Project views</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">blog_view</p>
                  <p className="text-xs text-slate-400 mt-2">Blog post views</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">chat_message</p>
                  <p className="text-xs text-slate-400 mt-2">Chat interactions</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">search_query</p>
                  <p className="text-xs text-slate-400 mt-2">Search usage</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">3d_interaction</p>
                  <p className="text-xs text-slate-400 mt-2">3D model usage</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-sm font-mono text-cyan-300">external_link_click</p>
                  <p className="text-xs text-slate-400 mt-2">Outbound links</p>
                </div>
              </div>
            </div>

            {/* Conversion Goals */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🎯 Conversion Goals</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-400">→</span>
                  <span><code className="text-cyan-300">goal_chat_sent</code> - Chat message interaction</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">→</span>
                  <span><code className="text-cyan-300">goal_project_visited</code> - Project engagement</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">→</span>
                  <span><code className="text-cyan-300">goal_resume_downloaded</code> - Resume access</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">→</span>
                  <span><code className="text-cyan-300">goal_contact_clicked</code> - Contact engagement</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">→</span>
                  <span><code className="text-cyan-300">goal_search_used</code> - Search utilization</span>
                </li>
              </ul>
            </div>

            {/* Implementation Guide */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📝 Integration Examples</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <div>
                  <p className="font-semibold text-white mb-2">Track an interaction:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { useAnalytics } from '@/hooks/use-analytics';

export function MyComponent() {
  const { onInteraction } = useAnalytics();
  
  return (
    <button onClick={() => onInteraction('button', 'click')}>
      Click me
    </button>
  );
}`}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Track a custom event:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { trackEvent } from '@/lib/analytics';

trackEvent({
  name: 'custom_event',
  data: {
    key: 'value',
    count: 42,
  }
});`}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Track a goal/conversion:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
{`import { trackGoal, Goals } from '@/lib/analytics';

trackGoal(Goals.CHAT_SENT);
trackGoal(Goals.PROJECT_VISITED);`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Viewing Real Data */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🔍 Viewing Your Analytics</h3>
              <p className="text-slate-300 text-sm mb-4">
                To view real analytics data:
              </p>
              <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                <li>Deploy to Vercel (required for analytics to work)</li>
                <li>Log in to your Vercel dashboard</li>
                <li>Navigate to your project → Analytics tab</li>
                <li>View metrics like page views, top pages, referrers, etc.</li>
                <li>Set up custom events in Vercel Analytics settings</li>
              </ol>
            </div>

            {/* Local Development Note */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">⚠️ Development Note</h3>
              <p className="text-slate-300 text-sm">
                Vercel Analytics only tracks data when deployed to Vercel. In local development,
                events are logged to the console in development mode but not sent to Vercel's servers.
              </p>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
