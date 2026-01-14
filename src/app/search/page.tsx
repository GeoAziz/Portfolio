import type { ComponentType } from 'react';
import { GlobalSearch as RawGlobalSearch } from '@/components/GlobalSearch';

const GlobalSearch = RawGlobalSearch as unknown as ComponentType<any>;

export const metadata = {
  title: 'Search | Portfolio',
  description: 'Search across all blog posts, research entries, and projects.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen py-12" data-testid="search-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3" data-testid="search-title">Search Content</h1>
          <p className="text-lg text-muted-foreground" data-testid="search-description">
            Search across all blog posts, research entries, and projects. Use tags and filters to narrow down results.
          </p>
        </div>

        <GlobalSearch />
      </div>
    </div>
  );
}
