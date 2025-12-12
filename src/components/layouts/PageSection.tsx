/**
 * PageSection Component
 * 
 * Standardized section wrapper with consistent spacing and animations.
 * Ensures uniform vertical rhythm across all pages.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { variants } from '@/lib/animation-variants';
import { cn } from '@/lib/utils';
import { spacing } from '@/lib/design-system';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'small' | 'normal' | 'large' | 'xlarge';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animate?: boolean;
  id?: string;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'w-full',
};

const spacingClasses = {
  small: 'space-y-6 my-8',
  normal: 'space-y-8 my-12',
  large: 'space-y-12 my-16',
  xlarge: 'space-y-16 my-24',
};

export function PageSection({
  children,
  className,
  spacing: spacingSize = 'normal',
  maxWidth = 'lg',
  animate = true,
  id,
}: PageSectionProps) {
  const content = (
    <section
      id={id}
      className={cn(
        'w-full mx-auto px-4 md:px-6',
        maxWidthClasses[maxWidth],
        spacingClasses[spacingSize],
        className
      )}
    >
      {children}
    </section>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants.container}
    >
      {content}
    </motion.div>
  );
}
