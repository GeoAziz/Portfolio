'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, Tag } from 'lucide-react';

interface SearchResult {
  type: 'blog' | 'research' | 'project';
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  relevance: number;
  highlighted?: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    type?: 'blog' | 'research' | 'project';
    tags: string[];
  }>({
    tags: [],
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagStats, setTagStats] = useState<Record<string, number>>({});

  // Load tags on mount
  const loadTags = useCallback(async () => {
    try {
      const response = await fetch('/api/search?tags=all');
      const data = await response.json();
      if (data.success) {
        setAllTags(data.data);
      }

      const statsResponse = await fetch('/api/search?tags=stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setTagStats(statsData.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);

  // Debounced search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() && activeFilters.tags.length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          ...(activeFilters.type && { type: activeFilters.type }),
          ...(activeFilters.tags.length > 0 && { tags: activeFilters.tags.join(',') }),
        });

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.data);
        } else {
          setError('Search failed');
        }
      } catch (error) {
        setError('Error performing search');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [activeFilters]
  );

  // Get suggestions
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  }, []);

  // Handle query change
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    getSuggestions(newQuery);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
    setSuggestions([]);
  };

  // Handle filter changes
  const handleTypeFilter = (type: 'blog' | 'research' | 'project' | null) => {
    setActiveFilters((prev) => ({
      ...prev,
      // ensure we never set `type` to null (state only allows undefined for "no type")
      type: type === prev.type ? undefined : (type ?? undefined),
    }));
  };

  const handleTagToggle = (tag: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search content..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch(query)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-accent/10 border-b border-border last:border-b-0 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => performSearch(query)}
            disabled={loading}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 transition"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Filters</p>
        </div>

        {/* Content Type Filters */}
        <div className="flex gap-2 flex-wrap">
          {(['blog', 'research', 'project'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                activeFilters.type === type
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-accent/20 text-accent hover:bg-accent/30'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tags:</p>
            <div className="flex gap-2 flex-wrap">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                    activeFilters.tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  {tagStats[tag] && <span className="text-xs opacity-75">({tagStats[tag]})</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(activeFilters.type || activeFilters.tags.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-muted-foreground">Active:</span>
            {activeFilters.type && (
              <button
                onClick={() => handleTypeFilter(null)}
                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-500/30 transition"
              >
                {activeFilters.type}
                <X className="w-3 h-3" />
              </button>
            )}
            {activeFilters.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded text-xs hover:bg-blue-500/30 transition"
              >
                {tag}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        {results.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
        )}

        {results.length === 0 && !loading && query && (
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No results found for "{query}"</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <Card key={`${result.type}-${result.slug}`} className="bg-card border-border hover:border-accent transition">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a
                        href={`/${result.type}s/${result.slug}`}
                        className="text-lg font-semibold text-accent hover:underline"
                      >
                        {result.title}
                      </a>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {result.type}
                        {result.date && ` • ${new Date(result.date).toLocaleDateString()}`}
                      </p>
                    </div>

                    {result.relevance > 0 && (
                      <div className="text-right">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-accent">
                            {Math.round(result.relevance * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {result.highlighted && (
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      {result.highlighted}
                    </p>
                  )}

                  {result.tags && result.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap pt-2">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-accent/10 text-accent rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 3 && (
                        <span className="px-2 py-1 text-muted-foreground text-xs">
                          +{result.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
