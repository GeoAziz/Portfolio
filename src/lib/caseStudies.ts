import caseStudiesData from '@/data/case-studies.json';
import projects from '@/data/projects.json';

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  projectRef: string;
  problem: string;
  solution: string;
  challenges: string[];
  results: { metric: string; value: string; context?: string }[];
  lessons: string[];
  screenshots?: string[];
  featured?: boolean;
  date?: string;
}

export function getAllCaseStudies(): CaseStudy[] {
  return (caseStudiesData as any).caseStudies as CaseStudy[];
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const all = getAllCaseStudies();
  return all.find(c => c.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getAllCaseStudies().filter(c => c.featured);
}

export function getProjectForCaseStudy(projectRef: string) {
  return (projects as any).find((p: any) => p.name === projectRef || p.title.includes(projectRef));
}
