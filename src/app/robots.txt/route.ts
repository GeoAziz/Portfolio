import { generateRobotsTxt } from '@/lib/seo';

/**
 * Dynamic robots.txt generation
 * GET /robots.txt
 */
export async function GET() {
  const robotsTxt = generateRobotsTxt();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
