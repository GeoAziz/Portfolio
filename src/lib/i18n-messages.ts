/**
 * i18n Messages loader
 * Separate file to avoid import issues in middleware
 */

import type { Locale } from '@/i18n.config';

// Message cache to avoid repeated imports
const messageCache: Record<string, any> = {};

/**
 * Get all messages for a locale
 * Loads messages dynamically to avoid build-time issues
 */
export async function getLocaleMessages(locale: Locale): Promise<Record<string, any>> {
  try {
    // Return cached messages if available
    if (messageCache[locale]) {
      return messageCache[locale];
    }

    // Dynamically import based on locale
    let messages: Record<string, any> = {};
    
    try {
      const module = await import(`@/i18n/messages/${locale}.json`, {
        assert: { type: 'json' }
      });
      messages = module.default || {};
    } catch {
      // If specific locale fails, try with dynamic template
      messages = await loadMessagesForLocale(locale);
    }

    // Cache the messages
    messageCache[locale] = messages;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    
    // Fallback to English
    try {
      if (!messageCache['en']) {
        const enModule = await import('@/i18n/messages/en.json', {
          assert: { type: 'json' }
        });
        messageCache['en'] = enModule.default || {};
      }
      return messageCache['en'];
    } catch {
      return {};
    }
  }
}

/**
 * Helper to load messages for a specific locale
 */
async function loadMessagesForLocale(locale: Locale): Promise<Record<string, any>> {
  // Fallback: return empty object, client can handle
  // In production, you'd fetch from an API or CDN
  return {
    common: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
    }
  };
}

/**
 * Get multiple locale messages in parallel
 */
export async function getMultipleLocaleMessages(
  locales: Locale[]
): Promise<Record<Locale, Record<string, any>>> {
  const messages = await Promise.all(
    locales.map((locale) => getLocaleMessages(locale))
  );

  return locales.reduce((acc, locale, idx) => {
    acc[locale] = messages[idx];
    return acc;
  }, {} as Record<Locale, Record<string, any>>);
}
