import { GlobalSearch } from '@/components/GlobalSearch';

export const metadata = {
  title: 'Search | Portfolio',
  description: 'Search across all blog posts, research entries, and projects.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Search Content</h1>
          <p className="text-lg text-muted-foreground">
            Search across all blog posts, research entries, and projects. Use tags and filters to narrow down results.
          </p>
        </div>

        <GlobalSearch />
      </div>
    </div>
  );
}
