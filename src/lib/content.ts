
import projects from '@/data/projects.json';
import hardware from '@/data/hardware.json';
import skills from '@/data/skills.json';
import identity from '@/content/identity.json';
import research from '@/data/research.json';
import resume from '@/data/resume.json';
import systems from '@/data/systems.json';
import ai from '@/data/ai.json';


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

export interface SystemsProject {
    id: string;
    title: string;
    role: string;
    tech: string[];
    short_description: string;
    long_description: string;
    architecture_hint: string;
    diagram_ascii: string[];
    interactive: boolean;
}

export interface SystemsData {
    systems_intro: {
        title: string;
        subtitle: string;
        description: string;
    };
    systems_skills: string[];
    systems_projects: SystemsProject[];
}

export interface AiModel {
    id: string;
    name: string;
    type: string;
    description: string;
    parameters: string;
    framework: string;
    strengths: string[];
    weaknesses: string[];
    sample_prompt: string;
    sample_output: string;
    tags: string[];
}

export interface AiExperiment {
    title: string;
    model: string;
    description: string;
    method: string;
    observation: string;
    result: string;
    dataset: string;
    tags: string[];
    interactive?: boolean; // To match ProjectInspector prop
    name?: string; // To match ProjectInspector prop
    tech?: string[]; // To match ProjectInspector prop
}

export interface AiThought {
    date: string;
    entry: string;
}

export interface AiData {
    models: AiModel[];
    experiments: AiExperiment[];
    skills: string[];
    thoughtLog: AiThought[];
}


export const projectsData: Project[] = projects;
export const hardwareData: HardwareProject[] = hardware;
export const skillsData: Skill[] = skills.map(skill => ({ ...skill, category: 'frontend' })); // Added dummy category
export const identityData: { statement: string; role: string } = identity;
export const researchData: ResearchItem[] = research;
export const resumeData: ResumeData = resume;
export const systemsData: SystemsData = systems;
export const aiData: AiData = ai;
