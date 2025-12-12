/**
 * i18n Configuration for next-intl
 * Supports: English (en), Arabic (ar), French (fr)
 */

// JSON module declarations moved to src/types/json.d.ts to avoid module augmentation errors

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
 * i18n configuration object for use in middleware and other utilities
 * Note: Message loading is handled separately in lib/i18n-messages.ts
 */
export const i18nConfig = {
  locales,
  defaultLocale,
  localeNames,
  localeFlags,
  isRTL,
};
