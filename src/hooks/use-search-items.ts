/**
 * Hook to aggregate searchable items from all content sources
 */

'use client';

import { useMemo } from 'react';
import { SearchableItem } from '@/lib/search';
import projectsData from '@/data/projects.json';
import hardwareData from '@/data/hardware.json';
import researchData from '@/data/research.json';
import aiData from '@/data/ai-experiments.json';
import openSourceData from '@/data/opensource.json';

/**
 * Aggregate all searchable content from the site
 */
export function useSearchItems(): SearchableItem[] {
  return useMemo(() => {
    const items: SearchableItem[] = [];

    // Add main pages
    const pages: SearchableItem[] = [
      {
        id: 'home',
        type: 'page',
        title: 'Home',
        description: 'Personal OS homepage - interactive systems and projects',
        url: '/',
        category: 'Navigation',
      },
      {
        id: 'systems',
        type: 'page',
        title: 'Systems',
        description: 'Complex systems and architecture exploration',
        url: '/systems',
        category: 'Navigation',
      },
      {
        id: 'ai',
        type: 'page',
        title: 'AI',
        description: 'AI experiments and models',
        url: '/ai',
        category: 'Navigation',
      },
      {
        id: 'hardware',
        type: 'page',
        title: 'Hardware',
        description: 'Hardware projects and specifications',
        url: '/hardware',
        category: 'Navigation',
      },
      {
        id: 'research',
        type: 'page',
        title: 'Research',
        description: 'Research papers and findings',
        url: '/research',
        category: 'Navigation',
      },
      {
        id: 'open-source',
        type: 'page',
        title: 'Open Source',
        description: 'Open source contributions and projects',
        url: '/open-source',
        category: 'Navigation',
      },
      {
        id: 'resume',
        type: 'page',
        title: 'Resume',
        description: 'Professional background and experience',
        url: '/resume',
        category: 'Navigation',
      },
      {
        id: 'blog',
        type: 'page',
        title: 'Blog',
        description: 'Technical writing and insights',
        url: '/blog',
        category: 'Navigation',
      },
    ];

    items.push(...pages);

    // Add projects
    try {
      projectsData?.forEach(project => {
        items.push({
          id: `project-${project.name}`,
          type: 'project',
          title: project.name,
          description: project.description || '',
          category: project.category,
          tags: project.tech || [],
          url: `/projects#${project.name.toLowerCase().replace(/\s+/g, '-')}`,
          content: `${project.name} ${project.description}`,
        });
      });
    } catch (e) {
      // If projects data not available, skip
    }

    // Add hardware
    try {
      hardwareData?.hardwareProjects?.forEach(hardware => {
        items.push({
          id: `hardware-${hardware.title}`,
          type: 'hardware',
          title: hardware.title,
          description: hardware.description || '',
          category: 'Hardware',
          tags: hardware.tags || hardware.components || [],
          url: `/hardware#${hardware.title.toLowerCase().replace(/\s+/g, '-')}`,
          content: `${hardware.title} ${hardware.description}`,
        });
      });
    } catch (e) {
      // If hardware data not available, skip
    }

    // Add AI experiments
    try {
      aiData?.experiments?.forEach(exp => {
        items.push({
          id: `ai-${exp.title}`,
          type: 'project',
          title: exp.title,
          description: exp.description || '',
          category: 'AI',
          tags: [],
          url: `/ai#${exp.title.toLowerCase().replace(/\s+/g, '-')}`,
          content: `${exp.title} ${exp.description}`,
        });
      });
    } catch (e) {
      // If AI data not available, skip
    }

    // Add research
    try {
      researchData?.researchEntries?.forEach(research => {
        items.push({
          id: `research-${research.title}`,
          type: 'research',
          title: research.title,
          description: research.summary || '',
          category: 'Research',
          tags: research.tags || [],
          url: `/research#${research.title.toLowerCase().replace(/\s+/g, '-')}`,
          content: `${research.title} ${research.summary}`,
        });
      });
    } catch (e) {
      // If research data not available, skip
    }

    // Add open source
    try {
      openSourceData?.openSourceProjects?.forEach(project => {
        items.push({
          id: `opensource-${project.name}`,
          type: 'project',
          title: project.name,
          description: project.description || '',
          category: 'Open Source',
          tags: project.languages || [],
          url: `/open-source#${project.name.toLowerCase().replace(/\s+/g, '-')}`,
          content: `${project.name} ${project.description}`,
        });
      });
    } catch (e) {
      // If open source data not available, skip
    }

    return items;
  }, []);
}
