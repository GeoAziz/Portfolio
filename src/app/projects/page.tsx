import { getAllProjects, getAllProjectTechs, getAllProjectCategories } from '@/lib/projects';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'A collection of engineering, AI, and systems projects.',
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();
  const allTechs = getAllProjectTechs();
  const allCategories = getAllProjectCategories();

  // Convert projects to serializable format
  const projectsData = allProjects.map(p => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    tech: p.tech,
    featured: p.featured,
  }));

  return (
    <ProjectsPageClient
      allProjects={projectsData}
      allTechs={allTechs}
      allCategories={allCategories}
    />
  );
}
