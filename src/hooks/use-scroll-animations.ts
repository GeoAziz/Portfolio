/**
 * Scroll-triggered Animations Hook
 * 
 * Uses Framer Motion's useInView and useScroll for scroll-based animations
 */

'use client';

import { useRef } from 'react';
import { useInView, useScroll, useTransform, useMotionValue, MotionValue } from 'framer-motion';

/**
 * Hook for scroll-triggered reveal animations
 * Returns ref to attach to animated element
 */
export function useScrollReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return {
    ref,
    inView,
  };
}

/**
 * Hook for parallax scroll effect
 * Returns transformed y value based on scroll progress
 */
export function useParallax(offset: number = 50): MotionValue<number> {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value: number) => value * offset * 0.1);
  return y;
}

/**
 * Hook for scroll-based opacity fade
 */
export function useScrollFade(threshold: number = 100): MotionValue<number> {
  const { scrollY } = useScroll();
  const opacity = useTransform(
    scrollY,
    [0, threshold],
    [0, 1]
  );
  return opacity;
}

/**
 * Hook for scroll-based scale
 */
export function useScrollScale(threshold: number = 200): MotionValue<number> {
  const { scrollY } = useScroll();
  const scale = useTransform(
    scrollY,
    [0, threshold],
    [0.8, 1]
  );
  return scale;
}

/**
 * Hook for scroll-based rotation
 */
export function useScrollRotate(maxRotate: number = 360, threshold: number = 1000): MotionValue<number> {
  const { scrollY } = useScroll();
  const rotate = useTransform(
    scrollY,
    [0, threshold],
    [0, maxRotate]
  );
  return rotate;
}

/**
 * Hook for scroll progress tracking (0-1)
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

/**
 * Hook for multiple scroll-triggered elements
 */
export function useScrollElements(threshold: number = -100) {
  const refs: React.RefObject<HTMLDivElement>[] = [];
  const inViews: boolean[] = [];

  return {
    createRef: () => {
      const ref = useRef<HTMLDivElement>(null);
      const inView = useInView(ref, { once: true, margin: `0px 0px ${threshold}px 0px` });
      refs.push(ref);
      inViews.push(inView);
      return { ref, inView };
    },
  };
}

/**
 * Hook for staggered scroll reveals
 */
export function useStaggeredScrollReveal(itemCount: number) {
  const refs = useRef<HTMLDivElement[]>([]);
  
  return {
    registerRef: (index: number, el: HTMLDivElement | null) => {
      if (el) refs.current[index] = el;
    },
    getItemInView: (index: number) => {
      if (!refs.current[index]) return false;
      const element = refs.current[index];
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.75;
    },
    refs: refs.current,
  };
}

/**
 * Hook for mouse parallax effect (on hover)
 */
export function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = (e.clientX - rect.left - centerX) / centerX;
    const offsetY = (e.clientY - rect.top - centerY) / centerY;

    x.set(offsetX * 10);
    y.set(offsetY * 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    x,
    y,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}

/**
 * Hook for detecting viewport intersection (visibility)
 */
export function useViewportIntersection(options?: { once?: boolean; margin?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: options?.once !== undefined ? options.once : false,
  });

  return { ref, inView };
}
