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

  // Check if locale is in pathname
  const localeFromPathname = getLocaleFromPathname(pathname);

  if (localeFromPathname) {
    // Locale is already in pathname, proceed
    return NextResponse.next();
  }

  // Check for locale preference in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let locale: string = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale as any)) {
    locale = cookieLocale;
  } else {
    // Detect from Accept-Language header
    locale = detectLocaleFromHeader(request);
  }

  // Redirect to locale-prefixed path
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );

  // Store locale preference in cookie
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 31536000, // 1 year
    path: '/',
  });

  return response;
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    // Skip internal Next.js routes and static files
    '/((?!_next|_vercel|api|.*\\..*|robots\\.txt|sitemap\\.xml|manifest\\.json|sw\\.js).*)',
  ],
};
