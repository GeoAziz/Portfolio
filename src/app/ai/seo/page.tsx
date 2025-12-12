'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { motion } from 'framer-motion';
import {
  generateMetadata,
  generateArticleSchema,
  generateSlug,
  calculateReadingTime,
  generateExcerpt,
} from '@/lib/seo';

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

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<'meta' | 'schema' | 'sitemap' | 'slug' | 'excerpt' | 'reading'>('meta');

  const sampleArticle = {
    title: 'The Engineer as a Systems Thinker',
    description: 'An introduction to viewing engineering as a mode of systems thinking and how it shapes better design decisions.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=1200&h=630&fit=crop',
    author: 'Mahnoor',
    datePublished: '2024-07-29',
  };

  const sampleContent = `
    The most impactful engineers are systems thinkers. They don't just see code, circuits, or models in isolation. 
    They see interconnected components, feedback loops, and emergent behaviors. They understand that a change in one 
    part of a system can have non-linear effects elsewhere. This is the foundation of good design.
    
    When we think about engineering as systems thinking, we're not just talking about technical systems. We're talking 
    about understanding how different parts interact, how constraints propagate, and how optimization in one area might 
    create new challenges elsewhere. This holistic view is what separates good engineers from great ones.
  `;

  const sampleText =
    'The most impactful engineers are systems thinkers. They dont just see code, circuits, or models in isolation. They see interconnected components, feedback loops, and emergent behaviors. They understand that a change in one part of a system can have non-linear effects elsewhere. This is the foundation of good design.';

  const readingTime = calculateReadingTime(sampleContent);
  const excerpt = generateExcerpt(sampleContent, 160);
  const slug = generateSlug(sampleArticle.title);
  const articleSchema = generateArticleSchema({
    ...sampleArticle,
    canonicalUrl: `https://devmahnx.com/blog/${slug}`,
  });

  const tabs = [
    {
      id: 'meta',
      label: 'Meta Tags',
      description: 'Metadata for OpenGraph and Twitter Cards',
    },
    {
      id: 'schema',
      label: 'Structured Data',
      description: 'JSON-LD schema.org markup for rich snippets',
    },
    {
      id: 'sitemap',
      label: 'Sitemap & Robots',
      description: 'Sitemap and robots.txt generation',
    },
    {
      id: 'slug',
      label: 'URL Slugs',
      description: 'SEO-friendly slug generation',
    },
    {
      id: 'excerpt',
      label: 'Excerpts',
      description: 'Auto-generated content excerpts',
    },
    {
      id: 'reading',
      label: 'Reading Time',
      description: 'Calculate reading time from content',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen">
      <SectionHeader title="SEO & Metadata Optimization" />

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
            Features Implemented
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Meta Tags',
                desc: 'OpenGraph, Twitter Cards, canonical URLs',
              },
              {
                title: 'Structured Data',
                desc: 'JSON-LD schemas (Article, Person, Organization)',
              },
              {
                title: 'Sitemaps',
                desc: 'Dynamic sitemap.xml generation with blog posts',
              },
              {
                title: 'Robots.txt',
                desc: 'Search engine crawling directives and rules',
              },
              {
                title: 'Dynamic OG Images',
                desc: 'API endpoint for custom social sharing images',
              },
              {
                title: 'Blog Metadata',
                desc: 'Automatic frontmatter extraction from MDX posts',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item} className="space-y-6">
          {/* Tab Navigation */}
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

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Meta Tags Tab */}
            {activeTab === 'meta' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    OpenGraph Meta Tags
                  </h4>
                  <CodeBlock
                    language="html"
                    code={`<meta property="og:title" content="${sampleArticle.title}" />
<meta property="og:description" content="${sampleArticle.description}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${sampleArticle.image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://devmahnx.com/blog/${slug}" />`}
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Twitter Card Meta Tags
                  </h4>
                  <CodeBlock
                    language="html"
                    code={`<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${sampleArticle.title}" />
<meta name="twitter:description" content="${sampleArticle.description}" />
<meta name="twitter:image" content="${sampleArticle.image}" />
<meta name="twitter:creator" content="@devmahnx" />`}
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Usage in page.tsx
                  </h4>
                  <CodeBlock
                    language="typescript"
                    code={`import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: '${sampleArticle.title}',
  description: '${sampleArticle.description}',
  keywords: ['engineering', 'systems-thinking'],
  author: '${sampleArticle.author}',
  ogImage: '${sampleArticle.image}',
});`}
                  />
                </div>
              </motion.div>
            )}

            {/* Schema Tab */}
            {activeTab === 'schema' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Article JSON-LD Schema
                  </h4>
                  <div className="relative">
                    <CodeBlock language="json" code={articleSchema} />
                    <CopyButton text={articleSchema} className="absolute top-4 right-4" />
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Implementation in Layout
                  </h4>
                  <CodeBlock
                    language="typescript"
                    code={`// In app/layout.tsx or article page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: articleSchema }}
/>

// Or pass as props to article component
<ArticleComponent schema={articleSchema} />`}
                  />
                </div>
              </motion.div>
            )}

            {/* Sitemap Tab */}
            {activeTab === 'sitemap' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Sitemap Entries
                  </h4>
                  <CodeBlock
                    language="xml"
                    code={`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://devmahnx.com/</loc>
    <lastmod>2024-12-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://devmahnx.com/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://devmahnx.com/blog/the-engineer-as-systems-thinker</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`}
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Robots.txt Configuration
                  </h4>
                  <CodeBlock
                    language="text"
                    code={`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://devmahnx.com/sitemap.xml

# Block low-quality bots
User-agent: AhrefsBot
User-agent: SemrushBot
Disallow: /`}
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Routes
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">
                      <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">GET /sitemap.xml</code> - Dynamic
                      sitemap with all pages and blog posts
                    </p>
                    <p className="text-slate-300">
                      <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">GET /robots.txt</code> - Crawling
                      rules and directives
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Slug Tab */}
            {activeTab === 'slug' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Slug Generation Examples
                  </h4>
                  <div className="space-y-3">
                    {[
                      { input: 'The Engineer as a Systems Thinker', output: 'the-engineer-as-a-systems-thinker' },
                      { input: 'AI & Machine Learning: 2024', output: 'ai-machine-learning-2024' },
                      { input: 'Building Hardware: Tips & Tricks!', output: 'building-hardware-tips-tricks' },
                      { input: 'Deep-Dive: Database Optimization', output: 'deep-dive-database-optimization' },
                    ].map((example) => (
                      <div key={example.input} className="border border-slate-700 rounded p-3 bg-slate-800/30">
                        <p className="text-slate-400 text-sm mb-2">Input:</p>
                        <p className="text-white font-mono mb-3">{example.input}</p>
                        <p className="text-slate-400 text-sm mb-2">Output:</p>
                        <p className="text-cyan-400 font-mono">{example.output}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Implementation
                  </h4>
                  <CodeBlock
                    language="typescript"
                    code={`import { generateSlug } from '@/lib/seo';

const title = '${sampleArticle.title}';
const slug = generateSlug(title);
// Result: '${slug}'

// Use in dynamic routes
<Link href={'/blog/' + slug}>{title}</Link>`}
                  />
                </div>
              </motion.div>
            )}

            {/* Excerpt Tab */}
            {activeTab === 'excerpt' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Generated Excerpt (160 chars)
                  </h4>
                  <div className="bg-slate-800 rounded p-4 border border-slate-700">
                    <p className="text-slate-300 text-sm">{excerpt}</p>
                    <p className="text-slate-500 text-xs mt-3">
                      {excerpt.length} characters • Perfect for meta descriptions and preview cards
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Usage
                  </h4>
                  <CodeBlock
                    language="typescript"
                    code={`import { generateExcerpt } from '@/lib/seo';

const content = '${sampleContent.trim().substring(0, 100)}...';
const excerpt = generateExcerpt(content, 160);
// Result: "${excerpt}"

// Use in metadata
export const metadata = generateMetadata({
  title: 'Article Title',
  description: excerpt,
});`}
                  />
                </div>
              </motion.div>
            )}

            {/* Reading Time Tab */}
            {activeTab === 'reading' && (
              <motion.div variants={item} className="space-y-6">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Reading Time Calculation
                  </h4>
                  <div className="bg-slate-800 rounded p-4 border border-slate-700">
                    <p className="text-slate-300 mb-2">
                      <span className="text-cyan-400 font-mono text-lg">{readingTime}</span>
                      <span className="text-slate-400 ml-2">minute read</span>
                    </p>
                    <p className="text-slate-500 text-sm">
                      {sampleContent.trim().split(/\s+/).length} words @ 200 words per minute
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">→</span>
                    Implementation
                  </h4>
                  <CodeBlock
                    language="typescript"
                    code={`import { calculateReadingTime } from '@/lib/seo';

const content = '${sampleContent.trim().substring(0, 80)}...';
const readingTime = calculateReadingTime(content);
// Result: ${readingTime} minutes

// Display in article
<div className="text-slate-400 text-sm">
  {readingTime} min read • {wordCount} words
</div>`}
                  />
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-4">Reading Time Formula</h4>
                  <p className="text-slate-300 font-mono text-center py-4">⌈ Word Count ÷ 200 ⌉ = Minutes</p>
                  <p className="text-slate-400 text-sm text-center">
                    Standard reading pace: 200 words per minute
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Integration Guide */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">
              ⚙
            </span>
            Integration Points
          </h3>

          <div className="space-y-4 text-slate-300">
            <div className="border-l-2 border-cyan-500 pl-4 py-2">
              <p className="font-semibold text-white">Root Layout (layout.tsx)</p>
              <p className="text-sm mt-1">Update root metadata with generateMetadata()</p>
            </div>

            <div className="border-l-2 border-cyan-500 pl-4 py-2">
              <p className="font-semibold text-white">Page-Specific Metadata</p>
              <p className="text-sm mt-1">Each page.tsx can export custom metadata</p>
            </div>

            <div className="border-l-2 border-cyan-500 pl-4 py-2">
              <p className="font-semibold text-white">Blog Post Extraction</p>
              <p className="text-sm mt-1">
                Use extractBlogMetadata() for dynamic blog post SEO metadata from MDX frontmatter
              </p>
            </div>

            <div className="border-l-2 border-cyan-500 pl-4 py-2">
              <p className="font-semibold text-white">API Endpoints</p>
              <p className="text-sm mt-1">
                /sitemap.xml, /robots.txt, /api/og for dynamic generation
              </p>
            </div>

            <div className="border-l-2 border-cyan-500 pl-4 py-2">
              <p className="font-semibold text-white">JSON-LD Schema Scripts</p>
              <p className="text-sm mt-1">Inject into layout.tsx or article components for rich snippets</p>
            </div>
          </div>
        </motion.div>

        {/* Features Summary */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Performance & SEO Impact</h3>

          <div className="grid md:grid-cols-2 gap-6 text-slate-300 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">✓ Search Engine Visibility</h4>
              <p>Sitemap and robots.txt help search engines crawl and index your content effectively</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">✓ Social Sharing Preview</h4>
              <p>OpenGraph and Twitter Cards display beautiful previews when content is shared</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">✓ Rich Snippets</h4>
              <p>JSON-LD schema markup enables enhanced results in search engines (knowledge panels, ratings)</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">✓ Canonical URLs</h4>
              <p>Prevent duplicate content issues by specifying preferred URL versions</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">✓ Dynamic OG Images</h4>
              <p>Custom social sharing images generated on-the-fly with article metadata</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">✓ Blog Integration</h4>
              <p>Automatic metadata extraction from MDX frontmatter with SEO optimization</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
