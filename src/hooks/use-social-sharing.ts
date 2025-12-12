/**
 * React hook for social sharing
 */

'use client';

import { useCallback } from 'react';
import {
  openShareWindow,
  copyToClipboard,
  getPageShareOptions,
  getTwitterShareUrl,
  getLinkedInShareUrl,
  getFacebookShareUrl,
  getRedditShareUrl,
  getEmailShareUrl,
  emitShareEvent,
  ShareOptions,
} from '@/lib/social-sharing';
import { trackInteraction } from '@/lib/analytics';

/**
 * Hook for social sharing functionality
 */
export function useSocialSharing() {
  const shareOnTwitter = useCallback((options?: Partial<ShareOptions>) => {
    const finalOptions = getPageShareOptions(options);
    const url = getTwitterShareUrl(finalOptions);
    trackInteraction('social_share', 'twitter');
    emitShareEvent({ platform: 'twitter', url: finalOptions.url, title: finalOptions.title });
    openShareWindow(url, 'twitter');
  }, []);

  const shareOnLinkedIn = useCallback((options?: Partial<ShareOptions>) => {
    const finalOptions = getPageShareOptions(options);
    const url = getLinkedInShareUrl(finalOptions);
    trackInteraction('social_share', 'linkedin');
    emitShareEvent({ platform: 'linkedin', url: finalOptions.url, title: finalOptions.title });
    openShareWindow(url, 'linkedin');
  }, []);

  const shareOnFacebook = useCallback((options?: Partial<ShareOptions>) => {
    const finalOptions = getPageShareOptions(options);
    const url = getFacebookShareUrl(finalOptions);
    trackInteraction('social_share', 'facebook');
    emitShareEvent({ platform: 'facebook', url: finalOptions.url, title: finalOptions.title });
    openShareWindow(url, 'facebook');
  }, []);

  const shareOnReddit = useCallback((options?: Partial<ShareOptions>) => {
    const finalOptions = getPageShareOptions(options);
    const url = getRedditShareUrl(finalOptions);
    trackInteraction('social_share', 'reddit');
    emitShareEvent({ platform: 'reddit', url: finalOptions.url, title: finalOptions.title });
    openShareWindow(url, 'reddit');
  }, []);

  const shareViaEmail = useCallback((options?: Partial<ShareOptions>) => {
    const finalOptions = getPageShareOptions(options);
    const url = getEmailShareUrl(finalOptions);
    trackInteraction('social_share', 'email');
    emitShareEvent({ platform: 'email', url: finalOptions.url, title: finalOptions.title });
    window.location.href = url;
  }, []);

  const copyLink = useCallback(async (url?: string) => {
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const success = await copyToClipboard(finalUrl);
    if (success) {
      trackInteraction('social_share', 'copy');
      emitShareEvent({ platform: 'copy', url: finalUrl, title: document.title });
    }
    return success;
  }, []);

  return {
    shareOnTwitter,
    shareOnLinkedIn,
    shareOnFacebook,
    shareOnReddit,
    shareViaEmail,
    copyLink,
  };
}
