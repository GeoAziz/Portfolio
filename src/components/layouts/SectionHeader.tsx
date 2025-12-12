/**
 * SectionHeader Component
 * 
 * Reusable section title component with consistent styling.
 * Used across all pages for h2-level headers.
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { variants } from '@/lib/animation-variants';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div
      className={cn(alignmentClasses[align], className)}
      variants={variants.fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
