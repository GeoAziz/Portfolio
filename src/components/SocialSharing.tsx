/**
 * Social Sharing Component
 * 
 * Displays social sharing buttons for blog posts and projects
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getTwitterShareUrl,
  getLinkedInShareUrl,
  getFacebookShareUrl,
  getRedditShareUrl,
  getEmailShareUrl,
  copyToClipboard,
  openShareWindow,
  getPageShareOptions,
  emitShareEvent,
  ShareOptions,
} from '@/lib/social-sharing';
import { trackInteraction } from '@/lib/analytics';

interface SocialSharingProps {
  /** Title to share */
  title?: string;
  /** Description to share */
  description?: string;
  /** URL to share (defaults to current page) */
  url?: string;
  /** Display variant */
  variant?: 'horizontal' | 'vertical' | 'compact';
  /** Show labels with icons */
  showLabels?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** CSS class */
  className?: string;
}

interface ShareButton {
  id: string;
  label: string;
  icon: string;
  color: string;
  getUrl?: (options: ShareOptions) => string;
  action?: (options: ShareOptions) => void;
}

export function SocialSharing({
  title,
  description,
  url,
  variant = 'horizontal',
  showLabels = false,
  size = 'md',
  className = '',
}: SocialSharingProps) {
  const [copied, setCopied] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  // Get share options
  const shareOptions = getPageShareOptions({
    title: title || undefined,
    description: description || undefined,
    url: url || undefined,
  });

  // Social media buttons
  const shareButtons: ShareButton[] = [
    {
      id: 'twitter',
      label: 'Share on X',
      icon: '𝕏',
      color: 'hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800',
      getUrl: getTwitterShareUrl,
    },
    {
      id: 'linkedin',
      label: 'Share on LinkedIn',
      icon: '🔗',
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
      getUrl: getLinkedInShareUrl,
    },
    {
      id: 'facebook',
      label: 'Share on Facebook',
      icon: 'f',
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
      getUrl: getFacebookShareUrl,
    },
    {
      id: 'reddit',
      label: 'Share on Reddit',
      icon: '🔶',
      color: 'hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950',
      getUrl: getRedditShareUrl,
    },
    {
      id: 'email',
      label: 'Share via Email',
      icon: '✉️',
      color: 'hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
      getUrl: getEmailShareUrl,
      action: (options) => {
        window.location.href = getEmailShareUrl(options);
      },
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: '📋',
      color: 'hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950',
      action: async (options) => {
        const success = await copyToClipboard(options.url);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      },
    },
  ];

  const handleShare = (button: ShareButton) => {
    // Track analytics
    trackInteraction('social_sharing', button.id);
    emitShareEvent({
      platform: button.id as any,
      url: shareOptions.url,
      title: shareOptions.title,
    });

    // Execute share action
    if (button.action) {
      button.action(shareOptions);
    } else if (button.getUrl) {
      const shareUrl = button.getUrl(shareOptions);
      openShareWindow(shareUrl, button.id);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base',
  };

  const containerClasses = {
    horizontal: 'flex gap-2 flex-wrap',
    vertical: 'flex flex-col gap-2',
    compact: 'flex gap-1',
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {variant === 'vertical' ? (
        // Full vertical layout with labels
        shareButtons.map((button) => (
          <motion.button
            key={button.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShare(button)}
            className={`${sizeClasses[size]} ${button.color} w-full flex items-center gap-3 rounded border border-slate-200 dark:border-slate-700 transition-colors`}
            title={button.label}
          >
            <span>{button.icon}</span>
            <span>{button.label}</span>
          </motion.button>
        ))
      ) : (
        // Horizontal compact layout
        shareButtons.map((button) => (
          <motion.button
            key={button.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(button)}
            className={`${sizeClasses[size]} ${button.color} rounded-full border border-slate-200 dark:border-slate-700 transition-colors`}
            title={button.label}
          >
            <span>{button.icon}</span>
          </motion.button>
        ))
      )}

      {/* Copy Link Feedback */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ✓ Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
