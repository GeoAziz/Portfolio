'use client';

import { useState, useEffect } from 'react';
import { SkeletonCard, SkeletonProjectCard, SkeletonList } from './SkeletonCard';

interface LoadingStateProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'card' | 'project' | 'list';
  count?: number;
}

export function LoadingState({ children, delay = 300, type = 'card', count = 3 }: LoadingStateProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    if (type === 'list') return <SkeletonList count={count} />;
    if (type === 'project') return <SkeletonProjectCard />;
    return <SkeletonCard />;
  }

  return <>{children}</>;
}
