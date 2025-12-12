/**
 * Scroll-Triggered Reveal Component
 * 
 * Reveals content when it comes into view
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'slideInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
}

/**
 * Scroll-triggered reveal component
 * Animates in when element comes into view
 */
export function ScrollReveal({
  children,
  className = '',
  variant = 'slideInUp',
  delay = 0,
}: ScrollRevealProps) {
  const { ref, inView } = useScrollReveal();

  const variants = {
    slideInUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    slideInRight: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealGroupProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'slideInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  staggerDelay?: number;
}

/**
 * Group multiple scroll reveals with stagger effect
 */
export function ScrollRevealGroup({
  children,
  className = '',
  variant = 'slideInUp',
  staggerDelay = 0.1,
}: ScrollRevealGroupProps) {
  const { ref, inView } = useScrollReveal();

  const childrenArray = React.Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, idx) => (
        <ScrollReveal
          key={idx}
          variant={variant}
          delay={inView ? idx * staggerDelay : 0}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
