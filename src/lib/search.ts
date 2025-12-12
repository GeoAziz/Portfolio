/**
 * Global Search Utilities
 * 
 * Fuzzy search across all content using Fuse.js
 */

import Fuse from 'fuse.js';

export interface SearchableItem {
  id: string;
  type: 'project' | 'blog' | 'hardware' | 'research' | 'page';
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  url: string;
  content?: string;
}

/**
 * Create a Fuse instance with optimal search settings
 */
export function createSearchIndex(items: SearchableItem[]): Fuse<SearchableItem> {
  return new Fuse(items, {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'description', weight: 0.6 },
      { name: 'category', weight: 0.4 },
      { name: 'tags', weight: 0.5 },
      { name: 'content', weight: 0.3 },
    ],
    threshold: 0.4, // Allow some typos (0 = exact, 1 = very loose)
    minMatchCharLength: 2,
    shouldSort: true,
    includeScore: true,
    includeMatches: false,
  });
}

/**
 * Search items with fuzzy matching
 */
export function searchItems(
  fuse: Fuse<SearchableItem>,
  query: string
): (SearchableItem & { score: number })[] {
  if (!query.trim()) return [];

  const results = fuse.search(query);
  return results.map(result => ({
    ...result.item,
    score: result.score || 0,
  }));
}

/**
 * Get search results grouped by type
 */
export function groupResultsByType(
  results: (SearchableItem & { score: number })[]
): Record<string, (SearchableItem & { score: number })[]> {
  return results.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, (SearchableItem & { score: number })[]>);
}

/**
 * Get search results grouped by category
 */
export function groupResultsByCategory(
  results: (SearchableItem & { score: number })[]
): Record<string, (SearchableItem & { score: number })[]> {
  return results.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, (SearchableItem & { score: number })[]>);
}

/**
 * Get type label for display
 */
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    project: '📦 Project',
    blog: '📝 Blog Post',
    hardware: '⚙️ Hardware',
    research: '🔬 Research',
    page: '📄 Page',
  };
  return labels[type] || type;
}

/**
 * Get type icon emoji
 */
export function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    project: '📦',
    blog: '📝',
    hardware: '⚙️',
    research: '🔬',
    page: '📄',
  };
  return icons[type] || '📌';
}

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, term: string): string {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
