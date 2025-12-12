/**
 * React hook for analytics tracking
 */

'use client';

import { useCallback } from 'react';
import {
  trackInteraction,
  trackProjectClick,
  trackBlogView,
  trackChatMessage,
  trackSearch,
  track3DInteraction,
  trackThemeChange,
  trackExternalLink,
  trackGoal,
  Goals,
} from '@/lib/analytics';

/**
 * Hook providing analytics tracking functions
 */
export function useAnalytics() {
  const onInteraction = useCallback((component: string, action: string) => {
    trackInteraction(component, action);
  }, []);

  const onProjectClick = useCallback((name: string, id: string) => {
    trackProjectClick(name, id);
    trackGoal(Goals.PROJECT_VISITED);
  }, []);

  const onBlogView = useCallback((title: string, slug: string) => {
    trackBlogView(title, slug);
  }, []);

  const onChatMessage = useCallback((count: number) => {
    trackChatMessage(count);
    trackGoal(Goals.CHAT_SENT);
  }, []);

  const onSearch = useCallback((query: string, resultCount: number) => {
    trackSearch(query, resultCount);
    trackGoal(Goals.SEARCH_USED);
  }, []);

  const on3DInteraction = useCallback((model: string, action: string) => {
    track3DInteraction(model, action);
  }, []);

  const onThemeChange = useCallback((theme: 'light' | 'dark' | 'system') => {
    trackThemeChange(theme);
  }, []);

  const onExternalLink = useCallback((url: string, label?: string) => {
    trackExternalLink(url, label);
  }, []);

  const onResumeDownload = useCallback(() => {
    trackGoal(Goals.RESUME_DOWNLOADED);
  }, []);

  const onContactClick = useCallback(() => {
    trackGoal(Goals.CONTACT_CLICKED);
  }, []);

  return {
    onInteraction,
    onProjectClick,
    onBlogView,
    onChatMessage,
    onSearch,
    on3DInteraction,
    onThemeChange,
    onExternalLink,
    onResumeDownload,
    onContactClick,
  };
}
