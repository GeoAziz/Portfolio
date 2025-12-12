/**
 * Project Filter Utilities
 * 
 * Advanced filtering and sorting for projects
 * Supports multi-select filters, URL state, and fuzzy search
 */

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
  interactive: boolean;
  category: 'AI' | 'Hardware' | 'Systems' | 'Other';
  image: string;
}

export interface FilterOptions {
  categories: string[];
  technologies: string[];
  status: 'all' | 'interactive' | 'static';
  searchQuery: string;
  sortBy: 'name' | 'recent' | 'tech-count';
}

export const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  technologies: [],
  status: 'all',
  searchQuery: '',
  sortBy: 'name',
};

/**
 * Extract all unique categories from projects
 */
export function getAvailableCategories(projects: Project[]): string[] {
  if (!projects || !Array.isArray(projects)) return [];
  const categories = new Set(projects.map(p => p.category).filter(Boolean));
  return Array.from(categories).sort();
}

/**
 * Extract all unique technologies from projects
 */
export function getAvailableTechnologies(projects: Project[]): string[] {
  if (!projects || !Array.isArray(projects)) return [];
  const techs = new Set<string>();
  projects.forEach(p => {
    if (p && p.tech && Array.isArray(p.tech)) {
      p.tech.forEach(t => techs.add(t));
    }
  });
  return Array.from(techs).sort();
}

/**
 * Filter projects based on filter options
 */
export function filterProjects(projects: Project[], filters: FilterOptions): Project[] {
  if (!projects || !Array.isArray(projects)) return [];
  
  let filtered = projects;

  // Filter by category
  if (filters.categories.length > 0) {
    filtered = filtered.filter(p => p && filters.categories.includes(p.category));
  }

  // Filter by technology
  if (filters.technologies.length > 0) {
    filtered = filtered.filter(p =>
      p && p.tech && filters.technologies.some(tech => p.tech.includes(tech))
    );
  }

  // Filter by status (interactive/static)
  if (filters.status === 'interactive') {
    filtered = filtered.filter(p => p && p.interactive);
  } else if (filters.status === 'static') {
    filtered = filtered.filter(p => p && !p.interactive);
  }

  // Filter by search query (fuzzy search)
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(p => {
      if (!p) return false;
      const searchText = `${p.name} ${p.description} ${p.tech.join(' ')}`.toLowerCase();
      return fuzzyMatch(searchText, query);
    });
  }

  return filtered;
}

/**
 * Sort projects
 */
export function sortProjects(
  projects: Project[],
  sortBy: 'name' | 'recent' | 'tech-count'
): Project[] {
  const sorted = [...projects];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'recent':
      // In a real app, would use a date field. For now, reverse order
      return sorted.reverse();
    case 'tech-count':
      return sorted.sort((a, b) => b.tech.length - a.tech.length);
    default:
      return sorted;
  }
}

/**
 * Simple fuzzy match algorithm
 * Checks if all characters of query appear in text in order
 */
function fuzzyMatch(text: string, query: string): boolean {
  let queryIndex = 0;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === query.length;
}

/**
 * Convert filters to URL search params
 */
export function filtersToSearchParams(filters: FilterOptions): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }
  if (filters.technologies.length > 0) {
    params.set('techs', filters.technologies.join(','));
  }
  if (filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters.searchQuery) {
    params.set('search', filters.searchQuery);
  }
  if (filters.sortBy !== 'name') {
    params.set('sort', filters.sortBy);
  }

  return params;
}

/**
 * Parse URL search params to filters
 */
export function searchParamsToFilters(params: URLSearchParams): FilterOptions {
  const filters = { ...DEFAULT_FILTERS };

  if (params.has('categories')) {
    filters.categories = params.get('categories')?.split(',') || [];
  }
  if (params.has('techs')) {
    filters.technologies = params.get('techs')?.split(',') || [];
  }
  if (params.has('status')) {
    const status = params.get('status');
    if (status === 'interactive' || status === 'static') {
      filters.status = status;
    }
  }
  if (params.has('search')) {
    filters.searchQuery = params.get('search') || '';
  }
  if (params.has('sort')) {
    const sort = params.get('sort');
    if (sort === 'recent' || sort === 'tech-count') {
      filters.sortBy = sort;
    }
  }

  return filters;
}

/**
 * Get filter badge text (e.g., "3 filters applied")
 */
export function getFilterSummary(filters: FilterOptions): string {
  const parts: string[] = [];

  if (filters.categories.length > 0) {
    parts.push(`${filters.categories.length} category`);
  }
  if (filters.technologies.length > 0) {
    parts.push(`${filters.technologies.length} tech`);
  }
  if (filters.status !== 'all') {
    parts.push(filters.status);
  }
  if (filters.searchQuery) {
    parts.push(`"${filters.searchQuery}"`);
  }

  if (parts.length === 0) {
    return 'No filters';
  }

  return parts.join(' • ');
}
