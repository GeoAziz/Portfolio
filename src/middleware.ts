import { NextRequest, NextResponse } from 'next/server';
import { i18nConfig } from '@/i18n.config';

// Locales that are supported
const locales = i18nConfig.locales;
const defaultLocale = i18nConfig.defaultLocale;

// Helper to get locale from pathname
function getLocaleFromPathname(pathname: string): string | null {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}

// Helper to detect locale from Accept-Language header
function detectLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      return { code: code.split('-')[0].toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const { code } of languages) {
    if (locales.includes(code as any)) {
      return code;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Don't redirect API routes, static files, or special routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') || // Ignore files with extensions
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next();
  }

  // Check if locale is in pathname
  const localeFromPathname = getLocaleFromPathname(pathname);

  if (localeFromPathname) {
    // Locale is already in pathname, proceed
    return NextResponse.next();
  }

  // For now, don't redirect - keep routes as-is for backward compatibility
  // Locale switching will be handled via LanguageSwitcher component instead
  return NextResponse.next();
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    // Skip internal Next.js routes and static files
    '/((?!_next|_vercel|api|.*\\..*|robots\\.txt|sitemap\\.xml|manifest\\.json|sw\\.js).*)',
  ],
};
