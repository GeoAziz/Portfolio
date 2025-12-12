'use client';

import { motion } from 'framer-motion';
import { Giscus } from '@/components/Giscus';
import { useCommentSectionVisibility } from '@/hooks/use-giscus-comments';
import { ChevronDown } from 'lucide-react';

interface CommentsSectionProps {
  /**
   * Blog post title for discussion mapping
   */
  title?: string;

  /**
   * Show comments by default
   */
  defaultOpen?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Show toggle button
   */
  showToggle?: boolean;
}

/**
 * Comments Section Component
 * Wraps Giscus with collapsible UI and styling
 */
export function CommentsSection({
  title = 'Comments',
  defaultOpen = true,
  className = '',
  showToggle = true,
}: CommentsSectionProps) {
  const { isVisible, toggleVisibility, show } = useCommentSectionVisibility(defaultOpen);

  return (
    <motion.section
      className={`mt-16 pt-12 border-t border-slate-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with toggle */}
      {showToggle && (
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-3 mb-8 text-white hover:text-cyan-400 transition-colors group"
          aria-label={isVisible ? 'Collapse comments' : 'Expand comments'}
        >
          <motion.div
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 group-hover:text-cyan-400" />
          </motion.div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {!isVisible && (
            <span className="text-sm text-slate-400 ml-2">(Click to expand)</span>
          )}
        </button>
      )}

      {!showToggle && (
        <h2 className="text-2xl font-bold text-white mb-8">{title}</h2>
      )}

      {/* Comments container */}
      <motion.div
        initial={false}
        animate={{ height: isVisible ? 'auto' : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="space-y-6">
          {/* Info message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💬 Comments are powered by{' '}
              <a
                href="https://giscus.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-blue-200 underline"
              >
                Giscus
              </a>
              . Sign in with your GitHub account to comment and react to posts.
            </p>
          </div>

          {/* Giscus component */}
          <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-6 backdrop-blur">
            <Giscus
              mapping="pathname"
              inputPosition="top"
              reactions={true}
              loading="lazy"
            />
          </div>

          {/* Footer info */}
          <div className="text-center text-slate-400 text-sm py-4 border-t border-slate-700">
            <p>
              Comments are open source and stored in{' '}
              <a
                href="https://github.com/GeoAziz/Portfolio/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                GitHub Discussions
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Collapsed state message */}
      {!isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <button
            onClick={show}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            Click to view comments →
          </button>
        </motion.div>
      )}
    </motion.section>
  );
}

export default CommentsSection;
