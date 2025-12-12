'use client';

import { useEffect, useState } from 'react';

export interface GiscusMessage {
  giscus: {
    discussion?: {
      id: string;
      number: number;
      locked: boolean;
    };
    viewer?: {
      login: string;
      avatarUrl: string;
    };
    [key: string]: unknown;
  };
}

/**
 * Hook for handling Giscus comment interactions
 * - Tracks comment count
 * - Handles theme switching
 * - Manages iframe communication
 */
export function useGiscusComments(slug?: string) {
  const [discussionNumber, setDiscussionNumber] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isDiscussionLocked, setIsDiscussionLocked] = useState(false);
  const [viewerInfo, setViewerInfo] = useState<{
    login: string;
    avatarUrl: string;
  } | null>(null);

  // Listen for Giscus messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://giscus.app') return;

      if (event.data.giscus) {
        const data = event.data.giscus as GiscusMessage['giscus'];

        // Update discussion info
        if (data.discussion) {
          setDiscussionNumber(data.discussion.number);
          setIsDiscussionLocked(data.discussion.locked);
        }

        // Update viewer info
        if (data.viewer) {
          setViewerInfo({
            login: data.viewer.login as string,
            avatarUrl: data.viewer.avatarUrl as string,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update comment count by querying the DOM
  useEffect(() => {
    const updateCommentCount = () => {
      const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
      if (!iframe) return;

      try {
        // Try to get comment count from iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          // Giscus shows comment count in title or data attributes
          const count = iframeDoc.querySelectorAll('[data-expanded="true"]').length;
          setCommentCount(count);
        }
      } catch (error) {
        // Cross-origin restriction, silent fail
        console.debug('Cannot access Giscus iframe due to CORS');
      }
    };

    // Initial check after a delay to allow Giscus to load
    const timeout = setTimeout(updateCommentCount, 2000);
    const interval = setInterval(updateCommentCount, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return {
    discussionNumber,
    commentCount,
    isDiscussionLocked,
    viewerInfo,
  };
}

/**
 * Get comment section visibility
 * Use to conditionally show/hide comments section
 */
export function useCommentSectionVisibility(showComments: boolean = true) {
  const [isVisible, setIsVisible] = useState(showComments);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    toggleVisibility,
    show,
    hide,
  };
}
