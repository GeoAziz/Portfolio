/**
 * Newsletter Signup Component
 * 
 * Reusable email signup form with validation and feedback
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToNewsletter } from '@/lib/newsletter-service';
import { trackGoal, Goals } from '@/lib/analytics';

interface NewsletterSignupProps {
  /** Title for the form */
  title?: string;
  /** Description/subtitle */
  description?: string;
  /** Button text */
  buttonText?: string;
  /** CSS class for styling */
  className?: string;
  /** Where the signup is from (for tracking) */
  source?: string;
  /** Show first name field */
  showFirstName?: boolean;
  /** Callback when subscription succeeds */
  onSuccess?: () => void;
  /** Callback when subscription fails */
  onError?: (error: string) => void;
  /** Variant: default, inline, footer */
  variant?: 'default' | 'inline' | 'footer';
}

export function NewsletterSignup({
  title = 'Stay Updated',
  description = 'Get the latest insights delivered to your inbox',
  buttonText = 'Subscribe',
  className = '',
  source = 'unknown',
  showFirstName = false,
  onSuccess,
  onError,
  variant = 'default',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await subscribeToNewsletter({
        email,
        firstName: showFirstName ? firstName : undefined,
        source,
      });

      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setEmail('');
        if (showFirstName) setFirstName('');
        onSuccess?.();
        
        // Track goal
        trackGoal(Goals.CHAT_SENT); // Using existing goal, could create separate NEWSLETTER_SIGNUP goal
      } else {
        setMessage({ type: 'error', text: response.error || response.message });
        onError?.(response.error || response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage({ type: 'error', text: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Variant styles
  const variantClasses = {
    default: 'bg-slate-900/50 border border-slate-800 rounded-lg p-8',
    inline: 'bg-transparent',
    footer: 'bg-slate-800/50 rounded-lg p-6',
  };

  const formLayout = variant === 'inline' ? 'flex gap-2' : 'space-y-4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variantClasses[variant]} ${className}`}
    >
      {/* Header (hidden for inline variant) */}
      {variant !== 'inline' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-slate-400 mt-2">{description}</p>}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={formLayout}>
        {/* First Name (if enabled) */}
        {showFirstName && (
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            disabled={loading}
          />
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={`${
            variant === 'inline' ? 'flex-1' : 'w-full'
          } px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors`}
          disabled={loading}
        />

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !email}
          className={`${
            variant === 'inline' ? 'px-6' : 'w-full'
          } py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-all`}
        >
          {loading ? 'Subscribing...' : buttonText}
        </motion.button>
      </form>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-200'
              : 'bg-red-500/20 border border-red-500/50 text-red-200'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Privacy Notice (for default variant) */}
      {variant === 'default' && (
        <p className="text-xs text-slate-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </motion.div>
  );
}
