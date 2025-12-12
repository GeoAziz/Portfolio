/**
 * Dynamic Open Graph image generation
 * Generates custom OG images for social sharing
 * GET /api/og?title=...&description=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Personal OS';
  const description = searchParams.get('description') || 'A personal portfolio designed as an operating system.';

  // For now, return a placeholder SVG
  // In production, you can use libraries like Satori for more complex OG images
  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="accent" cx="100%" cy="0%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1000" cy="-100" r="300" fill="url(#accent)"/>
  
  <text x="600" y="240" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#ffffff">
    ${escapeXml(title)}
  </text>
  
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#cbd5e1">
    ${escapeXml(description)}
  </text>
  
  <line x1="570" y1="400" x2="630" y2="400" stroke="url(#bg)" stroke-width="4" stroke-linecap="round"/>
  
  <text x="600" y="590" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#94a3b8">
    devmahnx.com
  </text>
</svg>
  `.trim();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
