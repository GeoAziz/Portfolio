import { getContentFile } from '@/lib/content-storage';

/**
 * Advanced content search and filtering system
 * Supports full-text search, tagging, date ranges, and type filtering
 */

export interface SearchOptions {
  query?: string;
  type?: 'blog' | 'research' | 'project';
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  type: 'blog' | 'research' | 'project';
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  relevance: number; // 0-1 relevance score
  highlighted?: string; // Snippet with search query highlighted
}

/**
 * Calculate relevance score based on field matches
 */
function calculateRelevance(item: any, query: string, type: string): number {
  if (!query) return 1;

  const queryLower = query.toLowerCase();
  let score = 0;
  const maxScore = 5;

  // Exact title match is highest priority
  if (item.title && item.title.toLowerCase() === queryLower) {
    score += maxScore;
  } else if (item.title && item.title.toLowerCase().includes(queryLower)) {
    score += maxScore * 0.8;
  }

  // Summary/description match
  const summary = item.summary || item.description || item.abstract || '';
  if (summary.toLowerCase().includes(queryLower)) {
    score += maxScore * 0.5;
  }

  // Tags/technology match
  const tags = item.tags || item.tech || [];
  if (tags.some((t: string) => t.toLowerCase().includes(queryLower))) {
    score += maxScore * 0.6;
  }

  // Keywords match
  if (item.keywords && item.keywords.some((k: string) => k.toLowerCase().includes(queryLower))) {
    score += maxScore * 0.4;
  }

  // Normalize score between 0 and 1
  return Math.min(score / (maxScore * 2), 1);
}

/**
 * Create a highlighted snippet showing query context
 */
function createHighlight(text: string, query: string, maxLength = 150): string {
  if (!text || !query) return text.substring(0, maxLength);

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);

  if (index === -1) {
    return text.substring(0, maxLength) + '...';
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 100);

  let snippet = text.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  // Wrap query in bold markers
  snippet = snippet.replace(
    new RegExp(query, 'gi'),
    (match) => `**${match}**`
  );

  return snippet;
}

/**
 * Parse tags from various content formats
 */
function getTags(item: any): string[] {
  const tags = new Set<string>();

  // Explicit tags
  if (item.tags && Array.isArray(item.tags)) {
    item.tags.forEach((t: string) => {
      if (typeof t === 'string') tags.add(t.toLowerCase());
    });
  }

  // Technology tags (from projects)
  if (item.tech && Array.isArray(item.tech)) {
    item.tech.forEach((t: string) => {
      if (typeof t === 'string') tags.add(t.toLowerCase());
    });
  }

  // Category as tag
  if (item.category) {
    tags.add(item.category.toLowerCase());
  }

  // Keywords as tags
  if (item.keywords && Array.isArray(item.keywords)) {
    item.keywords.forEach((k: string) => {
      if (typeof k === 'string') tags.add(k.toLowerCase());
    });
  }

  return Array.from(tags);
}

/**
 * Perform advanced search across all content types
 */
export function searchContent(options: SearchOptions): SearchResult[] {
  const {
    query = '',
    type,
    tags = [],
    dateFrom,
    dateTo,
    featured,
    limit = 50,
    offset = 0,
  } = options;

  const results: SearchResult[] = [];

  // Search each content type
  const types: ('blog' | 'research' | 'project')[] = type ? [type] : ['blog', 'research', 'project'];

  types.forEach((contentType) => {
    const items = getContentFile(contentType);

    items.forEach((item: any) => {
      // Type filtering (already done by loop, but kept for clarity)
      if (type && contentType !== type) return;

      // Featured filter
      if (featured !== undefined) {
        const isFeatured = item.featured === true;
        if (isFeatured !== featured) return;
      }

      // Date filtering
      const itemDate = new Date(item.date || item.createdAt || 0);
      if (dateFrom && itemDate < dateFrom) return;
      if (dateTo && itemDate > dateTo) return;

      // Tag filtering
      const itemTags = getTags(item);
      if (tags.length > 0) {
        const hasAllTags = tags.every((tag) =>
          itemTags.some((t) => t.includes(tag.toLowerCase()))
        );
        if (!hasAllTags) return;
      }

      // Calculate relevance
      const relevance = calculateRelevance(item, query, contentType);

      // Only include if relevance is > 0 or no query
      if (query && relevance === 0) return;

      const result: SearchResult = {
        type: contentType,
        slug: item.slug || (item.title || '').toLowerCase().replace(/\s+/g, '-'),
        title: item.title || item.name || 'Untitled',
        summary: item.summary || item.description || item.abstract,
        date: item.date,
        tags: itemTags,
        relevance,
        highlighted: query ? createHighlight(
          item.summary || item.description || item.abstract || '',
          query
        ) : undefined,
      };

      results.push(result);
    });
  });

  // Sort by relevance (descending) then by date (descending)
  results.sort((a, b) => {
    if (Math.abs(a.relevance - b.relevance) > 0.01) {
      return b.relevance - a.relevance;
    }
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });

  // Apply pagination
  return results.slice(offset, offset + limit);
}

/**
 * Get all unique tags across all content
 */
export function getAllContentTags(): string[] {
  const tags = new Set<string>();

  const types: ('blog' | 'research' | 'project')[] = ['blog', 'research', 'project'];
  types.forEach((type) => {
    const items = getContentFile(type);
    items.forEach((item: any) => {
      getTags(item).forEach((tag) => tags.add(tag));
    });
  });

  return Array.from(tags).sort();
}

/**
 * Get tag statistics (count of items with each tag)
 */
export function getTagStats(): Record<string, number> {
  const stats: Record<string, number> = {};

  const types: ('blog' | 'research' | 'project')[] = ['blog', 'research', 'project'];
  types.forEach((type) => {
    const items = getContentFile(type);
    items.forEach((item: any) => {
      getTags(item).forEach((tag) => {
        stats[tag] = (stats[tag] || 0) + 1;
      });
    });
  });

  return stats;
}

/**
 * Get related content based on shared tags
 */
export function getRelatedContent(
  slug: string,
  type: 'blog' | 'research' | 'project',
  limit = 5
): SearchResult[] {
  const items = getContentFile(type);
  const currentItem = items.find((item: any) => 
    item.slug === slug || (item.title || '').toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!currentItem) return [];

  const currentTags = getTags(currentItem);
  if (currentTags.length === 0) return [];

  const results = searchContent({
    tags: currentTags,
    limit: limit + 1,
  });

  // Filter out the current item and return top results
  return results.filter((r) => r.slug !== slug).slice(0, limit);
}

/**
 * Search suggestions (autocomplete)
 */
export function getSearchSuggestions(query: string, limit = 10): string[] {
  if (!query || query.length < 2) return [];

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  // Get suggestions from titles
  const types: ('blog' | 'research' | 'project')[] = ['blog', 'research', 'project'];
  types.forEach((type) => {
    const items = getContentFile(type);
    items.forEach((item: any) => {
      if (item.title && item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }
    });
  });

  // Get suggestions from tags
  getAllContentTags().forEach((tag) => {
    if (tag.includes(queryLower)) {
      suggestions.add(tag);
    }
  });

  return Array.from(suggestions).slice(0, limit).sort();
}
