"use client";

import React from 'react';

export default function ErrorPage({ error }: { error?: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="500-page">
      <div className="text-center">
        <h1 className="text-4xl font-bold">500 — Internal Server Error</h1>
        <p className="mt-4 text-muted-foreground">Something went wrong. Try refreshing the page.</p>
        {error && <pre className="mt-4 text-xs text-red-600">{String(error)}</pre>}
      </div>
    </div>
  );
}
