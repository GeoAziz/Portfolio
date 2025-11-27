
import projects from '@/data/projects.json';
import hardware from '@/data/hardware.json';
import skills from '@/data/skills.json';
import identity from '@/content/identity.json';
import research from '@/data/research.json';
import resume from '@/data/resume.json';

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string | null;
  interactive: boolean;
  category: string;
  image: string;
  openSource?: boolean;
}

export interface HardwareProject {
  name: string;
  description: string;
  tech: string[];
  image: string;
  model: string;
}

export interface Skill {
  name: string;
  level: 'Advanced' | 'Intermediate';
}

export interface ResearchItem {
  title: string;
  publication: string;
  date: string;
  summary: string;
  link: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  year: string;
  details: string;
}

export interface ResumeData {
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: string[];
  achievements: string[];
}


export const projectsData: Project[] = projects;
export const hardwareData: HardwareProject[] = hardware;
export const skillsData: Skill[] = skills.map(skill => ({ ...skill, category: 'frontend' })); // Added dummy category
export const identityData: { statement: string; role: string } = identity;
export const researchData: ResearchItem[] = research;
export const resumeData: ResumeData = resume;
