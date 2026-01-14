'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface ProjectData {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tech: string[];
  featured?: boolean;
}

interface ProjectsPageClientProps {
  allProjects: ProjectData[];
  allTechs: string[];
  allCategories: string[];
}

export default function ProjectsPageClient({
  allProjects,
  allTechs,
  allCategories,
}: ProjectsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      // Filter by category
      if (selectedCategory && project.category !== selectedCategory) {
        return false;
      }

      // Filter by technologies
      if (selectedTechs.length > 0) {
        const hasAnyTech = selectedTechs.some(tech =>
          project.tech.some(t => t.toLowerCase() === tech.toLowerCase())
        );
        if (!hasAnyTech) return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.tech.some(t => t.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [allProjects, selectedCategory, selectedTechs, searchQuery]);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTechs([]);
    setSearchQuery('');
  };

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  return (
    <MotionFade>
      <div className="space-y-12" data-testid="projects-container">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground" data-testid="projects-title">
            Projects
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            A collection of projects spanning systems engineering, AI, distributed systems, and hardware design.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-2xl">{allProjects.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardDescription>Categories</CardDescription>
              <CardTitle className="text-2xl">{allCategories.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardDescription>Technologies</CardDescription>
              <CardTitle className="text-2xl">{allTechs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardDescription>Featured</CardDescription>
              <CardTitle className="text-2xl">{allProjects.filter(p => p.featured).length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 bg-card border border-border rounded-lg p-6" data-testid="projects-filter">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search Projects
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, tech, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              data-testid="projects-search"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2" data-testid="projects-filter-category">
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className="font-mono"
                  data-testid={`projects-filter-category-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Technology Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Filter by Technology
            </label>
            <div className="flex flex-wrap gap-2" data-testid="projects-filter-tech">
              {allTechs.map(tech => (
                <Button
                  key={tech}
                  variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTech(tech)}
                  className="font-mono text-xs"
                  data-testid={`projects-filter-tech-${tech}`}
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedTechs.length > 0 || searchQuery) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              data-testid="projects-filter-clear"
            >
              Clear Filters ({selectedCategory ? 1 : 0} + {selectedTechs.length})
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {allProjects.length} projects
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedTechs.length > 0 && ` with ${selectedTechs.join(', ')}`}
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-foreground">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 gap-6" data-testid="projects-featured-grid">
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block group"
                  data-testid={`project-card-featured-${index}`}
                >
                  <Card className="bg-card border-border hover:border-accent/50 transition-colors overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-6 p-6">
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            Featured
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl group-hover:text-accent transition-colors" data-testid={`project-title-featured-${index}`}>
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-base" data-testid={`project-summary-featured-${index}`}>
                          {project.summary}
                        </CardDescription>
                        <div className="flex flex-wrap gap-1 pt-2" data-testid={`project-tech-featured-${index}`}>
                          {project.tech.slice(0, 4).map(tech => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.tech.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tech.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center justify-end">
                        <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-colors">
                          <ArrowUpRight className="h-8 w-8 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects Grid */}
        {otherProjects.length > 0 && (
          <div className="space-y-6">
            {featuredProjects.length > 0 && (
              <h2 className="font-headline text-2xl font-bold text-foreground">
                Other Projects
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="projects-grid">
              {otherProjects.map((project, index) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block group"
                  data-testid={`project-card-${index}`}
                >
                  <Card className="bg-card border-border hover:border-accent/50 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-accent transition-colors pt-2" data-testid={`project-title-${index}`}>
                        {project.title}
                      </CardTitle>
                      <CardDescription data-testid={`project-summary-${index}`}>
                        {project.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1" data-testid={`project-tech-${index}`}>
                        {project.tech.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.tech.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found matching your filters.
            </p>
            <Button variant="secondary" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </MotionFade>
  );
}
