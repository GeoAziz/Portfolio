'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { giscusConfig, updateGiscusTheme, validateGiscusConfig } from '@/lib/comments';

interface GiscusProps {
  /**
   * GitHub discussion mapping strategy
   * pathname: Use URL pathname (recommended for blog posts)
   * url: Use full URL
   * title: Use page title
   * og:title: Use og:title meta tag
   */
  mapping?: 'pathname' | 'url' | 'title' | 'og:title';

  /**
   * Custom category for discussions
   */
  category?: string;

  /**
   * Position of comment input
   */
  inputPosition?: 'top' | 'bottom';

  /**
   * Enable/disable reactions
   */
  reactions?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Loading strategy
   */
  loading?: 'lazy' | 'auto';
}

/**
 * Giscus Comment Component
 * Wraps Giscus GitHub discussions integration
 * - Uses GitHub discussions as database
 * - No separate comments backend needed
 * - Automatic moderation via GitHub
 * - Full GitHub reaction support
 * - Thread support via GitHub discussions
 * - Works with dark/light theme
 */
export function Giscus({
  mapping = giscusConfig.mapping,
  category = giscusConfig.category,
  inputPosition = giscusConfig.inputPosition,
  reactions = giscusConfig.reactions,
  className = '',
  loading = giscusConfig.loading,
}: GiscusProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate configuration on mount
  useEffect(() => {
    const { isValid, errors } = validateGiscusConfig();
    if (!isValid) {
      console.error('Giscus configuration error:', errors);
      setError('Comments are not configured. Please set up Giscus environment variables.');
    }
  }, []);

  // Load Giscus script
  useEffect(() => {
    if (!containerRef.current || error) return;

    // Clear previous iframe if switching themes
    if (isLoaded) {
      const existingScript = containerRef.current.querySelector('script');
      if (existingScript) {
        existingScript.remove();
      }
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    // Set data attributes
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', giscusConfig.strict ? '1' : '0');
    script.setAttribute('data-reactions-enabled', reactions ? '1' : '0');
    script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata ? '1' : '0');
    if (inputPosition) {
      script.setAttribute('data-input-position', inputPosition);
    }

    // Set theme based on current mode
    const giscusTheme =
      theme === 'dark'
        ? 'dark'
        : theme === 'light'
          ? 'light'
          : giscusConfig.theme === 'preferred_color_scheme'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : giscusConfig.theme;

    script.setAttribute('data-theme', giscusTheme as string);
    script.setAttribute('data-lang', giscusConfig.lang || 'en');
    if (loading) {
      script.setAttribute('data-loading', loading);
    }

    // Error handler
    script.onerror = () => {
      setError('Failed to load comments. Please try again later.');
    };

    // Success handler
    script.onload = () => {
      setIsLoaded(true);
    };

    containerRef.current?.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
    };
  }, [category, mapping, reactions, inputPosition, loading, error]);

  // Update theme when it changes
  useEffect(() => {
    if (!isLoaded) return;

    const giscusTheme =
      theme === 'dark'
        ? 'dark'
        : theme === 'light'
          ? 'light'
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

    updateGiscusTheme(giscusTheme as 'light' | 'dark');
  }, [theme, isLoaded]);

  // Show error state
  if (error) {
    return (
      <div className={`bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-700 dark:text-yellow-400 text-sm">{error}</p>
        <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-2">
          To enable comments, configure your GitHub repository in environment variables.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`giscus-container ${isLoaded ? 'loaded' : 'loading'} ${className}`}
      style={{
        '--giscus-font-size': '14px',
      } as React.CSSProperties}
    />
  );
}

export default Giscus;
