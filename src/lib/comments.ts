/**
 * Comment System Utilities
 * Configuration and helpers for Giscus comment integration
 */

export interface GiscusConfig {
  repo: string; // "owner/repo" format
  repoId: string; // GitHub repo ID
  category: string; // Discussion category
  categoryId: string; // Category ID
  mapping: 'pathname' | 'url' | 'title' | 'og:title'; // Discussion mapping strategy
  strict?: boolean; // Require strict title matching
  reactions?: boolean; // Enable emoji reactions
  emitMetadata?: boolean; // Emit discussion metadata
  inputPosition?: 'top' | 'bottom'; // Comment input position
  theme?: 'light' | 'dark' | 'preferred_color_scheme' | 'transparent_dark' | 'noborder_light' | 'noborder_dark';
  lang?: string; // Language code
  loading?: 'lazy' | 'auto'; // Loading strategy
}

/**
 * Default Giscus configuration
 * These values should be configured for your GitHub repo
 */
export const giscusConfig: GiscusConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO || 'GeoAziz/Portfolio',
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || 'R_kgDOHxVYkQ',
  category: 'Blog Comments',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOHxVYkc4CZsBg',
  mapping: 'pathname', // Use URL pathname as discussion key
  strict: true, // Require strict URL matching
  reactions: true, // Enable emoji reactions
  emitMetadata: true, // Emit metadata for analytics
  inputPosition: 'top', // Show input at top
  theme: 'preferred_color_scheme', // Match system theme
  lang: 'en', // English
  loading: 'lazy', // Lazy load comments
};

/**
 * Generate Giscus script attributes
 * Returns the data attributes needed for Giscus iframe
 */
export function getGiscusAttributes(config: GiscusConfig = giscusConfig) {
  return {
    'data-repo': config.repo,
    'data-repo-id': config.repoId,
    'data-category': config.category,
    'data-category-id': config.categoryId,
    'data-mapping': config.mapping,
    'data-strict': config.strict ? '1' : '0',
    'data-reactions-enabled': config.reactions ? '1' : '0',
    'data-emit-metadata': config.emitMetadata ? '1' : '0',
    'data-input-position': config.inputPosition,
    'data-theme': config.theme,
    'data-lang': config.lang,
    'data-loading': config.loading,
  };
}

/**
 * Comment configuration helper
 * Generates Giscus configuration object for passing to components
 */
export function getCommentConfig(slug: string, overrides?: Partial<GiscusConfig>): GiscusConfig {
  return {
    ...giscusConfig,
    ...overrides,
  };
}

/**
 * Validate Giscus environment variables are configured
 */
export function validateGiscusConfig(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_GISCUS_REPO) {
    errors.push('NEXT_PUBLIC_GISCUS_REPO is not configured');
  }

  if (!process.env.NEXT_PUBLIC_GISCUS_REPO_ID) {
    errors.push('NEXT_PUBLIC_GISCUS_REPO_ID is not configured');
  }

  if (!process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID) {
    errors.push('NEXT_PUBLIC_GISCUS_CATEGORY_ID is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Message handler for Giscus iframe communication
 * Listen for messages from Giscus widget
 */
export function setupGiscusMessageListener(
  callback?: (message: Record<string, unknown>) => void
) {
  if (typeof window === 'undefined') return;

  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from giscus.app
    if (event.origin !== 'https://giscus.app') return;

    if (event.data.giscus) {
      callback?.(event.data.giscus);
    }
  };

  window.addEventListener('message', handleMessage);

  return () => window.removeEventListener('message', handleMessage);
}

/**
 * Send theme change message to Giscus iframe
 * Used when switching between light/dark mode
 */
export function updateGiscusTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return;

  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
  if (!iframe) return;

  const message = {
    giscus: {
      setConfig: {
        theme,
      },
    },
  };

  iframe.contentWindow?.postMessage(message, 'https://giscus.app');
}

/**
 * Comment threading configuration
 * Enable/disable thread replies
 */
export const commentThreadConfig = {
  enableThreads: true,
  maxThreadDepth: 3,
  showReplyCount: true,
  compressThreads: false, // Show all replies or compress nested ones
};

/**
 * Comment moderation configuration
 * Configure comment display rules
 */
export const commentModerationConfig = {
  showPending: false, // Hide pending comments
  showRejected: false, // Hide rejected comments
  showDeleted: true, // Show deleted comments (marked as deleted)
  autoApprove: true, // Auto-approve comments (Giscus handles this via GitHub)
};
