'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, locales, localeFlags, localeNames } from '@/i18n.config';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  ) || 'en';

  // Get pathname without locale prefix
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLocaleChange = (locale: Locale) => {
    setIsOpen(false);
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label="Change language"
      >
        <span className="text-lg">{localeFlags[currentLocale as Locale]}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[currentLocale as Locale]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}${pathWithoutLocale}`}
              onClick={() => handleLocaleChange(locale)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                currentLocale === locale
                  ? 'bg-gray-100 dark:bg-gray-800 font-semibold'
                  : ''
              } ${locale === 'ar' ? 'flex-row-reverse text-right' : ''}`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
