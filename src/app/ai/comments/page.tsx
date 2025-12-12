'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { CodeBlock } from '@/components/CodeBlock';
import { CommentsSection } from '@/components/CommentsSection';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState<'setup' | 'usage' | 'features' | 'config'>('setup');

  const tabs = [
    { id: 'setup', label: 'Setup Guide', description: 'Get started with Giscus' },
    { id: 'usage', label: 'Usage', description: 'How to use in your pages' },
    { id: 'features', label: 'Features', description: 'What Giscus provides' },
    { id: 'config', label: 'Configuration', description: 'Advanced options' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen">
      <SectionHeader title="Comment System with Giscus" />

      <motion.div variants={item} className="max-w-5xl mx-auto mt-16 space-y-12">
        {/* Overview */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">
              ✓
            </span>
            Giscus Integration
          </h3>

          <p className="text-slate-300 mb-4">
            Comments powered by GitHub Discussions. No separate backend needed—use your GitHub repo as the database.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { icon: '💬', title: 'GitHub-powered', desc: 'Comments stored in discussions' },
              { icon: '👤', title: 'GitHub Auth', desc: 'Sign in with GitHub account' },
              { icon: '😊', title: 'Reactions', desc: 'Emoji reactions on comments' },
              { icon: '🧵', title: 'Threads', desc: 'Discussion reply threads' },
              { icon: '🌓', title: 'Theme aware', desc: 'Auto-switches dark/light mode' },
              { icon: '⚡', title: 'Fast', desc: 'Lazy loaded, minimal JS' },
            ].map((feature) => (
              <div key={feature.title} className="border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                    <p className="text-slate-400 text-xs">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">1.</span>
                  Create GitHub Discussion Category
                </h4>
                <ol className="text-slate-300 space-y-2 text-sm list-decimal list-inside">
                  <li>Go to your GitHub repository Settings</li>
                  <li>Navigate to Discussions → Categories</li>
                  <li>Create a new category (e.g., "Blog Comments")</li>
                  <li>Note the category ID</li>
                </ol>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">2.</span>
                  Get Repository IDs
                </h4>
                <p className="text-slate-300 text-sm mb-4">
                  Use the{' '}
                  <a
                    href="https://giscus.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Giscus website
                  </a>{' '}
                  to find your repository and category IDs by entering your repo.
                </p>
                <div className="bg-slate-800 rounded p-3 border border-slate-700">
                  <p className="text-slate-400 text-xs font-mono">github.com/YOUR_USERNAME/YOUR_REPO</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">3.</span>
                  Configure Environment Variables
                </h4>
                <CodeBlock
                  language="env"
                  code={`# .env.local
NEXT_PUBLIC_GISCUS_REPO=YOUR_USERNAME/YOUR_REPO
NEXT_PUBLIC_GISCUS_REPO_ID=YOUR_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY_ID=YOUR_CATEGORY_ID`}
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  💡 The NEXT_PUBLIC_ prefix makes these variables accessible in the browser, which is safe for
                  public repository information.
                </p>
              </div>
            </motion.div>
          )}

          {/* Usage Tab */}
          {activeTab === 'usage' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Add to Blog Posts</h4>
                <CodeBlock
                  language="typescript"
                  code={`import { CommentsSection } from '@/components/CommentsSection';

export default function BlogPostPage() {
  return (
    <article>
      {/* Post content */}
      <h1>My Blog Post</h1>
      <p>Post content here...</p>

      {/* Add comments section */}
      <CommentsSection
        title="Leave a Comment"
        defaultOpen={true}
        showToggle={true}
      />
    </article>
  );
}`}
                />
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Direct Giscus Component</h4>
                <CodeBlock
                  language="typescript"
                  code={`import { Giscus } from '@/components/Giscus';

export default function CustomPage() {
  return (
    <section>
      <h2>Discussion Section</h2>
      <Giscus
        mapping="pathname"
        category="General Discussion"
        inputPosition="top"
        reactions={true}
        loading="lazy"
      />
    </section>
  );
}`}
                />
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">With Hook</h4>
                <CodeBlock
                  language="typescript"
                  code={`import { Giscus } from '@/components/Giscus';
import { useGiscusComments } from '@/hooks/use-giscus-comments';

export default function Page() {
  const { commentCount, discussionNumber, isDiscussionLocked } = useGiscusComments();

  return (
    <>
      {isDiscussionLocked && (
        <p className="text-yellow-400">Comments are closed for this post.</p>
      )}
      <Giscus />
      {discussionNumber && (
        <a href={\`https://github.com/YOU/REPO/discussions/\${discussionNumber}\`}>
          View on GitHub ({commentCount} comments)
        </a>
      )}
    </>
  );
}`}
                />
              </div>
            </motion.div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <motion.div variants={item} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'GitHub Authentication',
                    desc: 'Users sign in with GitHub to comment',
                  },
                  {
                    title: 'Discussion Threading',
                    desc: 'Support for nested discussion replies',
                  },
                  {
                    title: 'Emoji Reactions',
                    desc: 'React to comments with emojis',
                  },
                  {
                    title: 'Automatic Moderation',
                    desc: 'Spam filtering via GitHub',
                  },
                  {
                    title: 'Dark Mode Support',
                    desc: 'Auto-switches theme with app',
                  },
                  {
                    title: 'Lazy Loading',
                    desc: 'Comments load on demand',
                  },
                  {
                    title: 'Open Source',
                    desc: 'Comments in public discussions',
                  },
                  {
                    title: 'No Database',
                    desc: 'GitHub discussions is the DB',
                  },
                ].map((feature) => (
                  <div key={feature.title} className="border border-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <motion.div variants={item} className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Giscus Configuration</h4>
                <CodeBlock
                  language="typescript"
                  code={`// src/lib/comments.ts
export const giscusConfig: GiscusConfig = {
  repo: 'GeoAziz/Portfolio',                    // GitHub repo
  repoId: 'R_kgDOHxVYkQ',                       // From Giscus website
  category: 'Blog Comments',                     // Discussion category
  categoryId: 'DIC_kwDOHxVYkc4CZsBg',          // Category ID
  mapping: 'pathname',                           // Use URL as key
  strict: true,                                   // Require exact match
  reactions: true,                                // Enable reactions
  emitMetadata: true,                            // Track metadata
  inputPosition: 'top',                          // Input at top
  theme: 'preferred_color_scheme',               // Match system
  lang: 'en',                                    // Language
  loading: 'lazy',                               // Lazy load
};`}
                />
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="font-semibold text-white mb-4">Configuration Options</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-mono text-cyan-400">mapping</p>
                    <p className="text-slate-400">
                      'pathname' | 'url' | 'title' | 'og:title' — How to map discussions to pages
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400">strict</p>
                    <p className="text-slate-400">
                      boolean — Require exact URL match (recommended: true)
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400">reactions</p>
                    <p className="text-slate-400">boolean — Enable emoji reactions (default: true)</p>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400">inputPosition</p>
                    <p className="text-slate-400">'top' | 'bottom' — Where to show comment input</p>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400">loading</p>
                    <p className="text-slate-400">'lazy' | 'auto' — When to load comments</p>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400">theme</p>
                    <p className="text-slate-400">
                      'light' | 'dark' | 'preferred_color_scheme' — Which theme to use
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Example Section with Comments */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Live Example</h3>
          <CommentsSection
            title="Example Comments Section"
            defaultOpen={true}
            showToggle={true}
          />
        </motion.div>

        {/* Integration Info */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">📍 Integration Points</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>
              ✓ <code className="bg-slate-800 px-2 py-1 rounded">/blog/[slug]</code> — Blog post pages
            </li>
            <li>
              ✓ <code className="bg-slate-800 px-2 py-1 rounded">CommentsSection</code> — Reusable component
            </li>
            <li>
              ✓ <code className="bg-slate-800 px-2 py-1 rounded">useGiscusComments</code> — Hook for metadata
            </li>
            <li>
              ✓ Theme-aware (dark/light mode auto-switching)
            </li>
            <li>
              ✓ GitHub Discussion notifications
            </li>
            <li>
              ✓ Spam filtering via GitHub
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
