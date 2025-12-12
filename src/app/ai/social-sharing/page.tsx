/**
 * Social Sharing Demo Page
 */

'use client';

import { SectionHeader } from '@/components/SectionHeader';
import { SocialSharing } from '@/components/SocialSharing';
import { PageTransition } from '@/components/PageTransition';
import { useSocialSharing } from '@/hooks/use-social-sharing';

export default function SocialSharingPage() {
  const { shareOnTwitter, shareOnLinkedIn, copyLink } = useSocialSharing();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageTransition>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionHeader title="Social Sharing" />
          <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
            Share content across social media platforms
          </p>

          <div className="mt-12 space-y-12">
            {/* Horizontal Compact */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">Compact Horizontal</h3>
              <div className="bg-slate-950 p-6 rounded border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-4">Share this page:</p>
                <SocialSharing variant="compact" />
              </div>
            </div>

            {/* Horizontal with Labels */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">Horizontal with Labels</h3>
              <div className="bg-slate-950 p-6 rounded border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-4">Share this page:</p>
                <SocialSharing variant="horizontal" showLabels={true} />
              </div>
            </div>

            {/* Vertical Layout */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">Vertical Layout</h3>
              <div className="bg-slate-950 p-6 rounded border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-4">Share this page:</p>
                <div className="max-w-xs">
                  <SocialSharing variant="vertical" showLabels={true} />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">🎯 Features</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Share to X (Twitter), LinkedIn, Facebook, Reddit</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Email sharing with pre-filled subject and body</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Copy link to clipboard with feedback</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Multiple variants: compact, horizontal, vertical</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Analytics tracking for each share action</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Smooth animations and interactions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Customizable title, description, URL</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Dark mode compatible</span>
                </li>
              </ul>
            </div>

            {/* Implementation Guide */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📝 Implementation</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white font-semibold mb-2">Component Usage:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto text-slate-300">
{`import { SocialSharing } from '@/components/SocialSharing';

export function MyPage() {
  return (
    <SocialSharing
      title="Check this out"
      description="This is awesome"
      variant="horizontal"
      showLabels={true}
    />
  );
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Hook Usage:</p>
                  <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto text-slate-300">
{`import { useSocialSharing } from '@/hooks/use-social-sharing';

export function MyComponent() {
  const { shareOnTwitter, copyLink } = useSocialSharing();
  
  return (
    <button onClick={() => shareOnTwitter()}>
      Share on Twitter
    </button>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Platforms Supported */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">🌐 Supported Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">𝕏</p>
                  <p className="text-xs text-slate-400 mt-2">X (Twitter)</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">🔗</p>
                  <p className="text-xs text-slate-400 mt-2">LinkedIn</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">f</p>
                  <p className="text-xs text-slate-400 mt-2">Facebook</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">🔶</p>
                  <p className="text-xs text-slate-400 mt-2">Reddit</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">✉️</p>
                  <p className="text-xs text-slate-400 mt-2">Email</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-lg">📋</p>
                  <p className="text-xs text-slate-400 mt-2">Copy Link</p>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📊 Analytics Integration</h3>
              <p className="text-slate-300 text-sm mb-4">
                Each share action is tracked with analytics:
              </p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Platform shares tracked (twitter, linkedin, facebook, reddit, email, copy)</li>
                <li>• Share events emitted for custom listeners</li>
                <li>• Analytics goals integrated with existing system</li>
                <li>• Can track conversion metrics by platform</li>
              </ul>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
