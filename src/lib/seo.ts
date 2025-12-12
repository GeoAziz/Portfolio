/**
 * SEO Utilities
 * Comprehensive SEO metadata, structured data, and optimization helpers
 */

import { Metadata } from 'next';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterHandle?: string;
  author?: string;
  keywords?: string[];
  published?: string;
  updated?: string;
}

/**
 * Generate Next.js Metadata object
 */
export function generateMetadata(seo: SEOMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';
  const canonical = seo.canonical || baseUrl;
  const ogImage = seo.ogImage || `${baseUrl}/og-image.png`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: seo.ogType || 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [ogImage],
      creator: seo.twitterHandle || '@devmahnx',
    },
  } as Metadata;
}

/**
 * JSON-LD Schema.org markup generator
 */
export function generateJsonLD(
  type: 'Person' | 'Organization' | 'BlogPosting' | 'Article' | 'WebPage',
  data: Record<string, unknown>
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';

  const schemas: Record<string, object> = {
    Person: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mahnoor',
      url: baseUrl,
      sameAs: [
        'https://twitter.com/devmahnx',
        'https://linkedin.com/in/devmahnx',
        'https://github.com/devmahnx',
      ],
      ...data,
    },
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Personal OS',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/devmahnx',
        'https://linkedin.com/in/devmahnx',
        'https://github.com/devmahnx',
      ],
      ...data,
    },
    BlogPosting: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      inLanguage: 'en-US',
      ...data,
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      inLanguage: 'en-US',
      ...data,
    },
    WebPage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      inLanguage: 'en-US',
      ...data,
    },
  };

  return JSON.stringify(schemas[type] || schemas.WebPage, null, 2);
}

/**
 * Article/BlogPost schema generator (commonly used)
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  canonicalUrl?: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/og-image.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'Mahnoor',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Personal OS',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# Crawl-delay: 1

Sitemap: ${sitemapUrl}

# Google-specific rules
User-agent: Googlebot
Allow: /

# Bing-specific rules
User-agent: Bingbot
Allow: /

# Block bad bots
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: MJ12bot
Disallow: /
`;
}

/**
 * Generate sitemap.xml entry for a single page
 */
export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';

  const entriesXml = entries
    .map(
      (entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
${entry.lastModified ? `    <lastmod>${entry.lastModified}</lastmod>\n` : ''}${entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>\n` : ''}${entry.priority ? `    <priority>${entry.priority}</priority>\n` : ''}  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entriesXml}
</urlset>`;
}

/**
 * Open Graph image generation meta tags
 */
export function generateOGImageMeta(
  title: string,
  description?: string,
  options?: {
    backgroundColor?: string;
    textColor?: string;
  }
): string {
  // URL-encode parameters for dynamic OG image generation
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';
  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';
  // Remove trailing slash for consistency
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return `${baseUrl}${cleanPath}`;
}

/**
 * SEO-friendly slug generator
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract reading time from text
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate excerpt from content (first N characters)
 */
export function generateExcerpt(text: string, length: number = 160): string {
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, length)
    .concat('...');
}

/**
 * Sitemap routes for common pages
 */
export const defaultSitemapRoutes: SitemapEntry[] = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/projects', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/ai', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/hardware', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/research', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/open-source', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/resume', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/newsletter', priority: 0.7, changeFrequency: 'weekly' },
];

/**
 * Breadcrumb schema generator
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Project schema generator (CreativeWork)
 */
export function generateProjectSchema(project: {
  name: string;
  description: string;
  summary?: string;
  category?: string;
  keywords?: string[];
  image?: string;
  slug: string;
  github?: string;
  liveDemo?: string;
  featured?: boolean;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description || project.summary,
    keywords: project.keywords?.join(', ') || '',
    inLanguage: 'en',
    url: `${baseUrl}/projects/${project.slug}`,
    ...(project.image && {
      image: {
        '@type': 'ImageObject',
        url: project.image.startsWith('http') ? project.image : `${baseUrl}${project.image}`,
      },
    }),
    ...(project.github && {
      codeRepository: project.github,
    }),
    ...(project.category && {
      category: project.category,
    }),
    author: {
      '@type': 'Person',
      name: 'Geo Aziz',
    },
  };

  return JSON.stringify(schema);
}

/**
 * Organization schema generator
 */
export function generateOrganizationSchema(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Geo Aziz',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Systems engineer, AI researcher, and open-source developer focused on distributed systems, hardware design, and AI ethics.',
    sameAs: [
      'https://twitter.com/geoaziz',
      'https://github.com/GeoAziz',
      'https://linkedin.com/in/geoaziz',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General',
      email: 'hello@geoaziz.com',
    },
  };

  return JSON.stringify(schema);
}

/**
 * Person schema generator
 */
export function generatePersonSchema(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Geo Aziz',
    url: baseUrl,
    image: `${baseUrl}/avatar.jpg`,
    jobTitle: 'Systems Engineer & AI Researcher',
    description:
      'Systems engineer, AI researcher, and open-source developer focused on distributed systems, hardware design, and AI ethics.',
    sameAs: [
      'https://twitter.com/geoaziz',
      'https://github.com/GeoAziz',
      'https://linkedin.com/in/geoaziz',
    ],
  };

  return JSON.stringify(schema);
}

/**
 * FAQ schema generator
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Website schema with search action
 */
export function generateWebSiteSchema(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Geo Aziz - Systems Journal',
    url: baseUrl,
    description:
      'Systems engineering, AI research, distributed systems, and hardware design.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(schema);
}
