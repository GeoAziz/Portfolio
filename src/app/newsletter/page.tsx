/**
 * Newsletter Subscription Page
 */

'use client';

import { SectionHeader } from '@/components/SectionHeader';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { PageTransition } from '@/components/PageTransition';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageTransition>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionHeader title="Stay Updated" />
          <p className="text-slate-400 text-center max-w-2xl mx-auto mt-4">
            Get weekly insights on systems engineering, AI research, and building at the intersection of curiosity and computation.
          </p>

          <div className="mt-12 space-y-8">
            {/* Newsletter Form */}
            <div className="max-w-md mx-auto">
              <NewsletterSignup
                title="Join 500+ Curious Engineers"
                description="Weekly digest of new projects, research findings, and technical deep dives"
                buttonText="Subscribe Now"
                showFirstName={true}
                source="dedicated_page"
              />
            </div>

            {/* What You'll Get */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 mt-12">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">📬 What You'll Receive</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <p className="font-semibold text-white">New Projects</p>
                    <p className="text-sm text-slate-400">Launches and detailed case studies</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-white">Systems Insights</p>
                    <p className="text-sm text-slate-400">Architecture patterns and learnings</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="font-semibold text-white">AI & Research</p>
                    <p className="text-sm text-slate-400">Cutting-edge findings and experiments</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold text-white">Hardware Builds</p>
                    <p className="text-sm text-slate-400">Electronics and embedded systems</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Unsubscribe */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🔒 Privacy First</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>No spam. Only valuable content sent to your inbox.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Your email is never shared with third parties.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Unsubscribe anytime with one click.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>GDPR compliant. Your data is protected.</span>
                </li>
              </ul>
            </div>

            {/* FAQ */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">❓ FAQ</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-white mb-2">How often will I hear from you?</p>
                  <p className="text-sm text-slate-400">
                    Once per week (usually on Sundays). You'll get a curated digest of the week's projects, findings, and insights.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Can I change my subscription preferences?</p>
                  <p className="text-sm text-slate-400">
                    After subscribing, you can manage your preferences in the confirmation email. You can also unsubscribe anytime.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Will you use my email for anything else?</p>
                  <p className="text-sm text-slate-400">
                    No. Your email is used exclusively for sending the newsletter. We never share it with third parties.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">What if I want to reach out directly?</p>
                  <p className="text-sm text-slate-400">
                    You can always contact me at dev@devmahnx.com or find me on GitHub. Each newsletter also includes my contact info.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof / Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-cyan-400 mb-6">📈 Community Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">500+</p>
                  <p className="text-sm text-slate-400 mt-2">Subscribers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">100%</p>
                  <p className="text-sm text-slate-400 mt-2">Open Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">52</p>
                  <p className="text-sm text-slate-400 mt-2">Issues Sent</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </div>
  );
}
