
import projects from '@/data/projects.json';
// import hardware from '@/data/hardware.json'; // Old hardware data
import skills from '@/data/skills.json';
import identity from '@/content/identity.json';
import research from '@/data/research.json';
import resume from '@/data/resume.json';
import systems from '@/data/systems.json';
import * as aiModule from '@/data/ai.json';
import hardware from '@/data/hardware.json';
import opensource from '@/data/opensource.json';

const ai = aiModule.default || aiModule;


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

export interface OldHardwareProject {
  name: string;
  description: string;
  tech: string[];
  image: string;
  model: string;
}

export interface Skill {
  name: string;
  level: 'Advanced' | 'Intermediate';
  category: string;
}

export interface ResearchEntry {
  id: string;
  title: string;
  question: string;
  summary: string;
  status: 'ongoing' | 'concluded' | 'in revision';
  tags: string[];
}

export interface ResearchDetail {
  motivation: string;
  experiments: string[];
  findings: string[];
  future: string[];
}

export interface ResearchData {
  researchEntries: ResearchEntry[];
  researchDetails: { [key: string]: ResearchDetail };
  learningLog: { date: string; entry: string }[];
}

export interface ResumeData {
  header: {
    title: string;
    subtitle: string;
    statement: string;
  };
  expertise: {
    coreSkills: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  experience: {
    title: string;
    period: string;
    description: string;
  }[];
  projectsHighlight: {
    name: string;
    role: string;
    impact: string;
  }[];
  education: {
    mode: string;
    notes: string;
  };
  recognition: string[];
  contact: {
    availability: string;
    preferredChannels: string[];
  };
  downloadable: {
    label: string;
    file: string;
  };
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
    parameters?: string; // made optional
    framework?: string; // made optional
    strengths?: string[]; // made optional
    weaknesses?: string[]; // made optional
    sample_prompt?: string; // made optional
    sample_output?: string; // made optional
    tags: string[];
    dim?: number; // for embedding models
    usage?: string[]; // for embedding models
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
    interactive: boolean;
    name: string; // To match ProjectInspector prop
    tech: string[]; // To match ProjectInspector prop
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

export interface HardwareProject {
  id: string;
  title: string;
  description: string;
  components: string[];
  skills: string[];
  status: string;
  notes: string;
  tags: string[];
  interactive?: boolean; // to conform to ProjectInspector
}

export interface HardwareLog {
  date: string;
  entry: string;
}

export interface HardwareData {
  hardwareProjects: HardwareProject[];
  componentInventory: string[];
  skills: string[];
  engineeringLog: HardwareLog[];
}

export interface OpenSourceProject {
    id: string;
    name: string;
    description: string;
    languages: string[];
    tags: string[];
    repo: string;
    status: string;
    version: string;
    license: string;
    interactive?: boolean;
    title?: string;
}

export interface Contributor {
    handle: string;
    contributions: number;
}

export interface Philosophy {
    statement: string;
    values: string[];
}

export interface OpenSourceData {
    openSourceProjects: OpenSourceProject[];
    contributors: Contributor[];
    philosophy: Philosophy;
}


export const projectsData: Project[] = projects;
export const skillsData: Skill[] = skills.map(skill => ({ ...skill, category: getCategory(skill.name) }));

function getCategory(skillName: string): 'frontend' | 'backend' | 'tools' {
    const backendSkills = ['Python', 'Distributed Systems', 'Machine Learning', 'Node.js', 'Rust', 'C++'];
    const toolSkills = ['Docker', 'Git', 'Arduino', 'Firebase', 'Linux', 'Bash', 'PCB Design', 'Embedded Systems', 'Verilog'];
    if (backendSkills.includes(skillName)) return 'backend';
    if (toolSkills.includes(skillName)) return 'tools';
    return 'frontend';
}


export const identityData: { statement: string; role: string } = identity;
export const researchData: ResearchData = research;
export const resumeData: ResumeData = resume;
export const systemsData: SystemsData = systems;
export const aiData: AiData = ai;
export const hardwareData: HardwareData = hardware;
export const openSourceData: OpenSourceData = opensource;
    
// Add interactive flag to AI experiments for ProjectInspector
if (aiData && aiData.experiments) {
    aiData.experiments.forEach(exp => {
        exp.interactive = true;
        exp.name = exp.title;
        exp.tech = exp.tags;
    });
}


// Add interactive flag to Hardware projects for ProjectInspector
hardwareData.hardwareProjects.forEach(proj => {
    proj.interactive = true;
});

// Add interactive flag to Open Source projects for ProjectInspector
openSourceData.openSourceProjects.forEach(proj => {
    proj.interactive = true;
    proj.title = proj.name;
});
