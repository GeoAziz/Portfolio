/**
 * Parallax Section Component
 * 
 * Creates a parallax scroll effect with multiple layers
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '@/hooks/use-scroll-animations';

interface ParallaxLayerProps {
  offset?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Individual parallax layer
 */
export function ParallaxLayer({
  offset = 50,
  children,
  className = '',
}: ParallaxLayerProps) {
  const y = useParallax(offset);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  layers?: Array<{
    content: React.ReactNode;
    offset?: number;
    className?: string;
  }>;
}

/**
 * Full parallax section with multiple layers
 */
export function ParallaxSection({
  children,
  className = '',
  layers,
}: ParallaxSectionProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {layers ? (
        layers.map((layer, idx) => (
          <ParallaxLayer
            key={idx}
            offset={layer.offset}
            className={layer.className}
          >
            {layer.content}
          </ParallaxLayer>
        ))
      ) : (
        <ParallaxLayer>{children}</ParallaxLayer>
      )}
    </div>
  );
}
