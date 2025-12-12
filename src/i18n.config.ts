/**
 * i18n Configuration for next-intl
 * Supports: English (en), Arabic (ar), French (fr)
 */

export type Locale = 'en' | 'ar' | 'fr';

export const locales: Locale[] = ['en', 'ar', 'fr'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ar: '🇸🇦',
  fr: '🇫🇷',
};

export const isRTL: Record<Locale, boolean> = {
  en: false,
  ar: true,
  fr: false,
};

/**
 * Get all messages for a locale
 * This function dynamically loads translation files
 */
export async function getMessages(locale: Locale) {
  try {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return (await import('@/i18n/messages/en.json')).default;
  }
}

/**
 * i18n configuration object for use in middleware and other utilities
 */
export const i18nConfig = {
  locales,
  defaultLocale,
  localeNames,
  localeFlags,
  isRTL,
};
