import { generateSitemapXml, defaultSitemapRoutes, SitemapEntry } from '@/lib/seo';
import fs from 'fs';
import path from 'path';

/**
 * Dynamic sitemap.xml generation
 * GET /sitemap.xml
 */
export async function GET() {
  // Start with default routes
  const routes: SitemapEntry[] = [...defaultSitemapRoutes];

  // Add blog posts dynamically if they exist
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir);
      files.forEach((file) => {
        if (file.endsWith('.mdx')) {
          const slug = file.replace('.mdx', '');
          routes.push({
            url: `/blog/${slug}`,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  } catch (error) {
    console.log('No blog directory found, skipping blog posts in sitemap');
  }

  // Generate sitemap XML
  const sitemap = generateSitemapXml(routes);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
