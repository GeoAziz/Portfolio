/**
 * Advanced Project Filter Component
 * 
 * Multi-select filters for category, technology, status
 * Real-time search, URL state management, and sorting
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Project,
  FilterOptions,
  DEFAULT_FILTERS,
  getAvailableCategories,
  getAvailableTechnologies,
  filterProjects,
  sortProjects,
  filtersToSearchParams,
  getFilterSummary,
} from '@/lib/project-filters';

// Support both interfaces - new advanced and old simple
interface ProjectFilterProps {
  projects: any[];
  onFilterChange?: (filtered: any[]) => void;
  onFiltersChange?: (filters: FilterOptions) => void;
  searchKeys?: string[]; // For backwards compatibility
  children?: (filteredProjects: any[]) => React.ReactNode; // For backwards compatibility
}

interface FilterPanelState {
  isOpen: boolean;
  activeTab: 'category' | 'tech' | 'status';
}

export function ProjectFilter({
  projects,
  onFilterChange,
  onFiltersChange,
  searchKeys = ['name', 'description'],
  children,
}: ProjectFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [panelState, setPanelState] = useState<FilterPanelState>({
    isOpen: false,
    activeTab: 'category',
  });
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const categories = getAvailableCategories(projects);
  const technologies = getAvailableTechnologies(projects);

  // Apply filters and trigger callback
  const applyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filtered = sortProjects(filterProjects(projects, newFilters), newFilters.sortBy);
    setFilteredProjects(filtered);
    onFilterChange?.(filtered);
    onFiltersChange?.(newFilters);

    // Update URL
    const params = filtersToSearchParams(newFilters);
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [projects, onFilterChange, onFiltersChange]);

  // Handle search with backwards compatibility (searchKeys)
  const handleSearchChange = (query: string) => {
    if (searchKeys.length > 0 && query) {
      // Simple text search through searchKeys
      const filtered = projects.filter((project: any) =>
        searchKeys.some(key => {
          const value = project[key];
          return value && String(value).toLowerCase().includes(query.toLowerCase());
        })
      );
      setFilteredProjects(filtered);
      onFilterChange?.(filtered);
    } else {
      applyFilters({ ...filters, searchQuery: query });
    }
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    applyFilters({ ...filters, categories: newCategories });
  };

  // Toggle technology filter
  const toggleTechnology = (tech: string) => {
    const newTechs = filters.technologies.includes(tech)
      ? filters.technologies.filter(t => t !== tech)
      : [...filters.technologies, tech];

    applyFilters({ ...filters, technologies: newTechs });
  };

  // Toggle status filter
  const toggleStatus = (status: 'all' | 'interactive' | 'static') => {
    applyFilters({ ...filters, status });
  };

  // Update sort
  const handleSortChange = (sortBy: 'name' | 'recent' | 'tech-count') => {
    applyFilters({ ...filters, sortBy });
  };

  // Clear all filters
  const handleClearFilters = () => {
    applyFilters(DEFAULT_FILTERS);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.technologies.length > 0 ||
    filters.status !== 'all' ||
    filters.searchQuery !== '';

  // If using children (backwards compatibility), return rendered children
  if (children) {
    return (
      <div className="space-y-4">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-slate-400">
          Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
        </div>

        {/* Rendered children */}
        {children(filteredProjects)}
      </div>
    );
  }

  // New advanced interface
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <input
          type="text"
          placeholder="Search projects by name, description, or tech..."
          value={filters.searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
        {filters.searchQuery && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
          >
            ✕
          </button>
        )}
      </motion.div>

      {/* Filter Controls & Sort */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"
      >
        <div className="flex gap-2 flex-wrap">
          {/* Filter Panel Toggle */}
          <button
            onClick={() => setPanelState(prev => ({ ...prev, isOpen: !prev.isOpen }))}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              panelState.isOpen || hasActiveFilters
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span className="text-lg">⚙️</span>
            Filters {hasActiveFilters && <span className="text-xs bg-cyan-500 text-black px-2 py-0.5 rounded">Active</span>}
          </button>

          {/* Status Badges */}
          <div className="flex gap-2">
            {(['all', 'interactive', 'static'] as const).map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  filters.status === status
                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {status === 'all' ? '📦 All' : status === 'interactive' ? '🎮 Interactive' : '📄 Static'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={e => handleSortChange(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-sm"
        >
          <option value="name">Sort: Name</option>
          <option value="recent">Sort: Recent</option>
          <option value="tech-count">Sort: Tech Stack</option>
        </select>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {panelState.isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              {/* Category Filter */}
              <FilterSection
                title="Categories"
                items={categories}
                selected={filters.categories}
                onToggle={toggleCategory}
                icon="📂"
              />

              <div className="my-4 border-t border-slate-700" />

              {/* Technology Filter */}
              <FilterSection
                title="Technologies"
                items={technologies}
                selected={filters.technologies}
                onToggle={toggleTechnology}
                icon="🔧"
                columns={3}
              />

              {/* Clear Button */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-slate-400 bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-700/30"
        >
          {getFilterSummary(filters)}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Filter Section Component - Reusable filter group
 */
interface FilterSectionProps {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  icon: string;
  columns?: number;
}

function FilterSection({
  title,
  items,
  selected,
  onToggle,
  icon,
  columns = 2,
}: FilterSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map(item => (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`px-3 py-2 rounded-lg text-sm transition-all text-left ${
              selected.includes(item)
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                : 'bg-slate-700/50 border border-slate-600/30 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  selected.includes(item)
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-slate-500'
                }`}
              >
                {selected.includes(item) && '✓'}
              </span>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { FilterSection };
