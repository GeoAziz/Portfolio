/**
 * Social Media Sharing Utilities
 * 
 * Generate share URLs for various platforms and track sharing events
 */

export interface ShareOptions {
  url: string;
  title: string;
  description?: string;
  image?: string;
  via?: string; // Twitter handle
  hashtags?: string[];
}

/**
 * Generate Twitter/X share URL
 */
export function getTwitterShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append('url', options.url);
  params.append('text', options.title);
  if (options.via) params.append('via', options.via);
  if (options.hashtags?.length) params.append('hashtags', options.hashtags.join(','));
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate LinkedIn share URL
 */
export function getLinkedInShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append('url', options.url);
  params.append('title', options.title);
  if (options.description) params.append('summary', options.description);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(options.url)}`;
}

/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append('u', options.url);
  params.append('quote', options.title);
  if (options.description) params.append('description', options.description);
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate Reddit share URL
 */
export function getRedditShareUrl(options: ShareOptions): string {
  const params = new URLSearchParams();
  params.append('url', options.url);
  params.append('title', options.title);
  return `https://reddit.com/submit?${params.toString()}`;
}

/**
 * Generate email share URL
 */
export function getEmailShareUrl(options: ShareOptions): string {
  const subject = encodeURIComponent(options.title);
  const body = encodeURIComponent(`${options.title}\n\n${options.description || ''}\n\n${options.url}`);
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Copy share URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Open share URL in a new window
 */
export function openShareWindow(url: string, platform: string): void {
  const width = 550;
  const height = 420;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

/**
 * Get current page share options
 */
export function getPageShareOptions(overrides?: Partial<ShareOptions>): ShareOptions {
  if (typeof window === 'undefined') {
    return {
      url: '',
      title: '',
      ...overrides,
    };
  }

  return {
    url: window.location.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined,
    via: 'devmahnx', // Twitter handle
    ...overrides,
  };
}

/**
 * Share event tracking
 */
export interface ShareEvent {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'reddit' | 'email' | 'copy';
  url: string;
  title: string;
}

/**
 * Share event listener function type
 */
export type OnShareListener = (event: ShareEvent) => void;

/**
 * Global share tracking (client-side)
 */
let shareListeners: OnShareListener[] = [];

/**
 * Register a share event listener
 */
export function onShare(listener: OnShareListener): () => void {
  shareListeners.push(listener);
  return () => {
    shareListeners = shareListeners.filter(l => l !== listener);
  };
}

/**
 * Emit a share event
 */
export function emitShareEvent(event: ShareEvent): void {
  shareListeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Error in share listener:', error);
    }
  });
}
