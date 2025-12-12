/**
 * Error Boundary Component
 * 
 * Gracefully handles component errors without crashing the entire app.
 * Provides user-friendly error UI and optional error logging.
 */

'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Optional: Send error to external logging service
    // (Sentry, LogRocket, etc.)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-500/30 bg-red-500/5 my-4">
          <CardHeader>
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="text-red-500">
                  {this.props.componentName
                    ? `Error in ${this.props.componentName}`
                    : 'Something went wrong'}
                </CardTitle>
                <CardDescription>
                  {this.state.error?.message ||
                    'An unexpected error occurred while loading this component.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {process.env.NODE_ENV === 'development' &&
                this.state.errorInfo && (
                  <details className="bg-card/50 rounded p-3 text-xs text-muted-foreground font-mono overflow-auto max-h-48">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Error Details
                    </summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              <Button
                onClick={this.resetError}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component for easier usage with custom fallback
 */
export function ErrorBoundaryWithFallback({
  children,
  componentName,
  fallbackTitle = 'Failed to Load',
  fallbackDescription,
}: {
  children: ReactNode;
  componentName?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}) {
  const fallback = (
    <Card className="border-yellow-500/30 bg-yellow-500/5 my-4">
      <CardHeader>
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <CardTitle className="text-yellow-600">{fallbackTitle}</CardTitle>
            {fallbackDescription && (
              <CardDescription>{fallbackDescription}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <ErrorBoundary
      fallback={fallback}
      componentName={componentName}
    >
      {children}
    </ErrorBoundary>
  );
}
