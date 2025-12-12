import fs from 'fs';
import path from 'path';

/**
 * Project Detail Interface with comprehensive metadata
 */
export interface Feature {
  title: string;
  description: string;
  impact?: string;
}

export interface ArchitectureSection {
  diagram?: string;
  description: string;
  components: string[];
  patterns: string[];
}

export interface Result {
  metric: string;
  value: string | number;
  context?: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface ProjectDetail {
  slug: string;
  name: string;
  title: string;
  summary: string;
  description?: string;
  overview: string; // Detailed description (500+ words)
  tech: string[];
  category: string;
  image?: string;
  link?: string;
  interactive?: boolean;
  openSource?: boolean;
  repo?: string;
  featured?: boolean;
  screenshots: string[]; // Project images
  features: Feature[]; // Feature list with impact
  architecture: ArchitectureSection; // Architecture details
  results: Result[]; // Key metrics and achievements
  timeline: TimelinePhase[]; // Project phases
  team?: TeamMember[]; // Team members
  liveDemo?: string; // Live demo URL
  github: string; // GitHub repo link
  keywords?: string[]; // SEO keywords
  relatedSlugs?: string[]; // Related projects
}

const projectsDirectory = path.join(process.cwd(), 'src', 'content');

/**
 * Get all projects with full detail data
 */
export function getAllProjects(): ProjectDetail[] {
  const filePath = path.join(projectsDirectory, 'projects.json');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    return projects.map((project: any) => ({
      slug: generateSlug(project.name),
      name: project.name || '',
      title: project.title || project.name || '',
      summary: project.summary || project.description || '',
      description: project.description,
      overview: project.overview || project.description || '',
      tech: project.tech || [],
      category: project.category || 'General',
      image: project.image,
      link: project.link,
      interactive: project.interactive || false,
      openSource: project.openSource || false,
      repo: project.repo,
      featured: project.featured || false,
      screenshots: project.screenshots || [],
      features: project.features || [],
      architecture: project.architecture || {
        description: '',
        components: [],
        patterns: [],
      },
      results: project.results || [],
      timeline: project.timeline || [],
      team: project.team,
      liveDemo: project.liveDemo,
      github: project.github || project.link || '',
      keywords: project.keywords,
      relatedSlugs: project.relatedSlugs,
    }));
  } catch (error) {
    console.error('Error reading projects.json:', error);
    return [];
  }
}

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): ProjectDetail | null {
  const projects = getAllProjects();
  return projects.find(p => p.slug === slug) || null;
}

/**
 * Get featured projects only
 */
export function getFeaturedProjects(limit = 3): ProjectDetail[] {
  const projects = getAllProjects();
  return projects.filter(p => p.featured).slice(0, limit);
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(category: string): ProjectDetail[] {
  const projects = getAllProjects();
  return projects.filter(p => p.category === category);
}

/**
 * Get all unique technologies/tags from projects
 */
export function getAllProjectTechs(): string[] {
  const projects = getAllProjects();
  const techs = new Set<string>();
  
  projects.forEach(project => {
    (project.tech || [])
      .filter(tech => tech && typeof tech === 'string')
      .forEach(tech => techs.add(tech));
  });
  
  return Array.from(techs).sort();
}

/**
 * Get all unique categories from projects
 */
export function getAllProjectCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set<string>();
  
  projects.forEach(project => {
    if (project.category) categories.add(project.category);
  });
  
  return Array.from(categories).sort();
}

/**
 * Get projects by technology/tag
 */
export function getProjectsByTech(tech: string): ProjectDetail[] {
  const projects = getAllProjects();
  return projects.filter(p => 
    (p.tech || [])
      .filter(t => t && typeof t === 'string')
      .some(t => t.toLowerCase() === tech.toLowerCase())
  );
}

/**
 * Get related projects based on shared technologies and category
 */
export function getRelatedProjects(slug: string, limit = 3): ProjectDetail[] {
  const currentProject = getProjectBySlug(slug);
  if (!currentProject) return [];

  const allProjects = getAllProjects();

  const scored = allProjects
    .filter(p => p.slug !== slug)
    .map(project => {
      let score = 0;

      // Bonus for same category
      if (project.category === currentProject.category) score += 5;

      // Bonus for shared technologies
      const sharedTechs = (project.tech || [])
        .filter(tech => tech && typeof tech === 'string')
        .filter(tech =>
          (currentProject.tech || [])
            .filter(t => t && typeof t === 'string')
            .some(t => t.toLowerCase() === tech.toLowerCase())
        );
      score += sharedTechs.length * 3;

      return { project, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);

  return scored;
}

/**
 * Generate URL-friendly slug from project name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Search projects by query string
 */
export function searchProjects(query: string): ProjectDetail[] {
  const projects = getAllProjects();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return projects;

  return projects.filter(project => {
    const searchableFields = [
      project.name,
      project.title,
      project.summary,
      project.description,
      project.overview,
      ...(project.tech || []),
      project.category,
      ...(project.keywords || []),
    ]
      .join(' ')
      .toLowerCase();

    return searchableFields.includes(normalizedQuery);
  });
}

/**
 * Get projects sorted by a specific field
 */
export function getSortedProjects(
  sortBy: 'name' | 'category' | 'featured' | 'recent' = 'name'
): ProjectDetail[] {
  const projects = getAllProjects();

  switch (sortBy) {
    case 'featured':
      return projects.sort((a, b) => {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      });
    case 'category':
      return projects.sort((a, b) => a.category.localeCompare(b.category));
    case 'recent':
      return projects; // Assuming order in JSON is most recent first
    case 'name':
    default:
      return projects.sort((a, b) => a.name.localeCompare(b.name));
  }
}
