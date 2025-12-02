'use client';

import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectFilterProps {
  projects: any[];
  children: (filteredProjects: any[]) => React.ReactNode;
  searchKeys?: string[];
  tags?: string[];
}

export function ProjectFilter({ projects, children, searchKeys = ['title', 'name', 'description'], tags = [] }: ProjectFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    if (tags.length > 0) return tags;
    
    const tagSet = new Set<string>();
    projects.forEach(project => {
      const projectTags = project.tags || project.tech || [];
      projectTags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [projects, tags]);

  // Filter projects based on search and tags
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' || searchKeys.some(key => {
        const value = project[key];
        return value && value.toLowerCase().includes(searchQuery.toLowerCase());
      });

      // Tag filter
      const projectTags = project.tags || project.tech || [];
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => 
        projectTags.includes(tag)
      );

      return matchesSearch && matchesTags;
    });
  }, [projects, searchQuery, selectedTags, searchKeys]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
      </div>

      {/* Filtered Content */}
      {children(filteredProjects)}
    </div>
  );
}
