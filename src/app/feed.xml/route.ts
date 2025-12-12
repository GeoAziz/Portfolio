import { getBlogPosts } from '@/lib/blog';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';
  const posts = getBlogPosts();

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a: any, b: any) => {
    return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
  });

  const latestDate = sortedPosts[0]?.metadata.date || new Date().toISOString();

  // Generate RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Geo Aziz - Systems Journal</title>
    <link>${baseUrl}</link>
    <description>Systems engineering, AI research, distributed systems, and hardware design.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    <managingEditor>hello@geoaziz.com</managingEditor>
    <webMaster>hello@geoaziz.com</webMaster>
    <ttl>3600</ttl>
    ${sortedPosts
      .map(
        (post: any) => `
    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.metadata.summary)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <author>hello@geoaziz.com${post.metadata.author ? ` (${post.metadata.author})` : ''}</author>
      ${post.metadata.tags?.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
      <comments>${baseUrl}/blog/${post.slug}#comments</comments>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Escape special characters in XML strings
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
