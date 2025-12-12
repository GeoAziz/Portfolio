/**
 * Lazy Loading Configuration
 * 
 * Dynamic imports with Suspense boundaries for heavy components.
 * Improves initial page load performance.
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { SkeletonCard, SkeletonGrid } from '@/components/SkeletonCard';

/**
 * Lazy load ModelViewer
 */
export const LazyModelViewer = dynamic(
  () => import('@/components/ModelViewer').then(mod => ({ default: mod.ModelViewer })),
  {
    loading: () => <SkeletonCard />,
    ssr: false,
  }
);

/**
 * Lazy load SkillOrbit
 */
export const LazySkillOrbit = dynamic(
  () => import('@/components/SkillOrbit').then(mod => ({ default: mod.SkillOrbit })),
  {
    loading: () => (
      <div className="w-full h-[320px] md:h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading cognitive map...</p>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy load ArchitectureDiagram
 */
export const LazyArchitectureDiagram = dynamic(
  () => import('@/components/ArchitectureDiagram').then(mod => ({ default: mod.ArchitectureDiagram })),
  {
    loading: () => <SkeletonGrid count={1} columns={2} />,
    ssr: false,
  }
);

/**
 * Lazy load ModelGraph
 */
export const LazyModelGraph = dynamic(
  () => import('@/components/ModelGraph').then(mod => ({ default: mod.ModelGraph })),
  {
    loading: () => <SkeletonCard />,
    ssr: false,
  }
);

/**
 * Lazy load InteractiveModelDemo
 */
export const LazyInteractiveModelDemo = dynamic(
  () => import('@/components/InteractiveModelDemo').then(mod => ({ default: mod.InteractiveModelDemo })),
  {
    loading: () => <SkeletonCard />,
    ssr: false,
  }
);

/**
 * Wrapper component with Suspense boundary
 */
interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyComponentWrapper({ 
  children, 
  fallback = <SkeletonCard /> 
}: LazyComponentWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

/**
 * Hook to check if component should be lazy loaded
 * Based on viewport size and performance metrics
 */
export function useLazyLoad(): boolean {
  // Determine if we should lazy load based on device capabilities
  if (typeof window === 'undefined') return false;
  
  // Don't lazy load on fast connections
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection.saveData) return true;
    if (connection.effectiveType === '4g') return false;
  }
  
  return true;
}
