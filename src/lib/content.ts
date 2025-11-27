
import projects from '@/content/projects.json';
import ai from '@/content/ai.json';
import hardware from '@/content/hardware.json';
import opensource from '@/content/opensource.json';
import skills from '@/content/skills.json';
import identity from '@/content/identity.json';
import research from '@/content/research.json';
import resume from '@/content/resume.json';

export interface Project {
  title: string;
  summary: string;
  stack: string[];
  architecture: string;
  responsibilities: string;
  link: string | null;
  image: string;
  model?: string;
}

export interface Skill {
  name: string;
  level: 'Advanced' | 'Intermediate';
  category: 'frontend' | 'backend' | 'tools';
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
export const aiData: Project[] = ai;
export const hardwareData: Project[] = hardware;
export const opensourceData: Project[] = opensource;
export const skillsData: Skill[] = skills;
export const identityData: { statement: string; role: string } = identity;
export const researchData: ResearchItem[] = research;
export const resumeData: ResumeData = resume;
