'use client';

import { useState, useEffect, useCallback } from 'react';
import { SkeletonCard, SkeletonProjectCard, SkeletonList } from './SkeletonCard';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'card' | 'project' | 'list';
  count?: number;
  isLoading?: boolean;
  error?: Error | null;
  errorFallback?: ReactNode;
  className?: string;
}

export function LoadingState({ 
  children, 
  delay = 300, 
  type = 'card', 
  count = 3,
  isLoading: externalLoading,
  error,
  errorFallback,
  className,
}: LoadingStateProps) {
  const [internalLoading, setInternalLoading] = useState(externalLoading ?? true);

  useEffect(() => {
    if (externalLoading !== undefined) {
      setInternalLoading(externalLoading);
    } else {
      const timer = setTimeout(() => {
        setInternalLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay, externalLoading]);

  const isLoading = externalLoading ?? internalLoading;

  if (error) {
    return (
      errorFallback || (
        <div className={cn('p-6 bg-destructive/10 border border-destructive/30 rounded-lg', className)}>
          <p className="text-destructive text-sm font-medium">
            Error loading content. Please try refreshing the page.
          </p>
        </div>
      )
    );
  }

  if (isLoading) {
    const skeleton = 
      type === 'list' ? <SkeletonList count={count} /> :
      type === 'project' ? <SkeletonProjectCard /> :
      <SkeletonCard />;
    
    return <div className={className}>{skeleton}</div>;
  }

  return <div className={className}>{children}</div>;
}

/**
 * useAsync Hook
 * 
 * A simple hook for managing async operations in components.
 * Usage:
 * const { data, isLoading, error } = useAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * }, []);
 */

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) {
  const [isLoading, setIsLoading] = useState(immediate);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      return response;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Error already set in state
      });
    }
  }, [execute, immediate]);

  return { isLoading, data, error, execute };
}
