/**
 * PageHeader Component
 * 
 * Reusable hero section for page titles and descriptions.
 * Eliminates duplication across all page headers.
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { variants } from '@/lib/animation-variants';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  animationDelay?: number;
}

export function PageHeader({
  title,
  description,
  icon,
  subtitle,
  className,
  animationDelay = 0,
}: PageHeaderProps) {
  return (
    <motion.section
      className={cn('space-y-4 max-w-4xl mx-auto text-center', className)}
      initial="hidden"
      animate="visible"
      variants={variants.container}
    >
      {/* Icon (optional) */}
      {icon && (
        <motion.div
          className="flex justify-center mb-6"
          variants={variants.fadeInUp}
        >
          {icon}
        </motion.div>
      )}

      {/* Main Title */}
      <motion.h1
        className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground"
        variants={variants.fadeInUp}
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        variants={variants.fadeInUp}
      >
        {description}
      </motion.p>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          className="text-md text-muted-foreground/80 max-w-2xl mx-auto"
          variants={variants.fadeInUp}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.section>
  );
}
