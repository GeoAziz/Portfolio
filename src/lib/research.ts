import { researchData } from './content';

export interface ResearchEntry {
  id: string;
  slug: string;
  title: string;
  question: string;
  summary: string;
  abstract: string;
  publication: string;
  date: string;
  authors: string[];
  keywords: string[];
  status: 'ongoing' | 'concluded' | 'in revision';
  tags: string[];
  citations: string[];
  doi?: string;
  pdfLink?: string;
  featuredImage?: string;
}

export interface ResearchDetails {
  motivation: string;
  experiments: string[];
  findings: string[];
  future: string[];
}

/**
 * Format citation in APA style
 * Input: "Author et al. (YYYY). Title. Publication."
 * Output: "Author, A., et al. (YYYY). Title. *Publication*."
 */
export function formatAPA(citation: string): string {
  // Clean up and standardize the citation
  const cleaned = citation.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * Format citation in MLA style
 * Input: "Author et al. (YYYY). Title. Publication."
 * Output: "Author, et al. \"Title.\" *Publication*, YYYY."
 */
export function formatMLA(citation: string): string {
  // Parse the citation string to extract components
  const match = citation.match(/(.+?)\s*\((\d{4})\)\.\s*(.+?)\.\s*(.+)\.?/);
  
  if (!match) return citation;
  
  const [, authors, year, title, publication] = match;
  
  return `${authors}. "${title}." *${publication}*, ${year}.`;
}

/**
 * Format citation in BibTeX style
 */
export function formatBibTeX(citation: string, key: string = 'citation'): string {
  const match = citation.match(/(.+?)\s*\((\d{4})\)\.\s*(.+?)\.\s*(.+)\.?/);
  
  if (!match) return `@article{${key},\n  note = {${citation}}\n}`;
  
  const [, authors, year, title, publication] = match;
  const firstAuthor = authors.split(/\s+and\s+|\s+et\s+al/)[0].split(' ').pop() || 'Unknown';
  
  return `@article{${firstAuthor}${year},
  author = {${authors}},
  title = {${title}},
  journal = {${publication}},
  year = {${year}}
}`;
}

/**
 * Get all research entries
 */
export function getResearchEntries(): ResearchEntry[] {
  const { researchEntries } = researchData;
  return researchEntries as ResearchEntry[];
}

/**
 * Get research entry by ID
 */
export function getResearchById(id: string): ResearchEntry | undefined {
  const entries = getResearchEntries();
  return entries.find(entry => entry.id === id);
}

/**
 * Get research entry by slug
 */
export function getResearchBySlug(slug: string): ResearchEntry | undefined {
  const entries = getResearchEntries();
  return entries.find(entry => entry.slug === slug);
}

/**
 * Get all unique keywords from research entries
 */
export function getAllResearchKeywords(): string[] {
  const entries = getResearchEntries();
  const keywords = new Set<string>();
  
  entries.forEach(entry => {
    entry.keywords.forEach(keyword => keywords.add(keyword));
  });
  
  return Array.from(keywords).sort();
}

/**
 * Filter research entries by keyword
 */
export function filterByKeyword(keyword: string): ResearchEntry[] {
  const entries = getResearchEntries();
  return entries.filter(entry => 
    entry.keywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );
}

/**
 * Filter research entries by status
 */
export function filterByStatus(status: 'ongoing' | 'concluded' | 'in revision'): ResearchEntry[] {
  const entries = getResearchEntries();
  return entries.filter(entry => entry.status === status);
}

/**
 * Filter research entries by year (parsed from date field)
 */
export function filterByYear(year: number): ResearchEntry[] {
  const entries = getResearchEntries();
  return entries.filter(entry => {
    const entryYear = parseInt(entry.date.split('-')[0], 10);
    return entryYear === year;
  });
}

/**
 * Get all unique years from research entries
 */
export function getAllResearchYears(): number[] {
  const entries = getResearchEntries();
  const years = new Set<number>();
  
  entries.forEach(entry => {
    const year = parseInt(entry.date.split('-')[0], 10);
    years.add(year);
  });
  
  return Array.from(years).sort((a, b) => b - a); // Descending order
}

/**
 * Get all unique publications
 */
export function getAllResearchPublications(): string[] {
  const entries = getResearchEntries();
  const publications = new Set<string>();
  
  entries.forEach(entry => {
    publications.add(entry.publication);
  });
  
  return Array.from(publications).sort();
}

/**
 * Filter research entries by publication
 */
export function filterByPublication(publication: string): ResearchEntry[] {
  const entries = getResearchEntries();
  return entries.filter(entry => 
    entry.publication.toLowerCase() === publication.toLowerCase()
  );
}

/**
 * Get research details for an entry
 */
export function getResearchDetails(id: string): ResearchDetails | undefined {
  const { researchDetails } = researchData;
  return researchDetails[id as keyof typeof researchDetails];
}

/**
 * Sort research entries by date (newest first)
 */
export function sortByDate(entries: ResearchEntry[]): ResearchEntry[] {
  return [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get related research entries (by keywords)
 */
export function getRelatedResearch(entry: ResearchEntry, limit: number = 3): ResearchEntry[] {
  const allEntries = getResearchEntries();
  
  // Find entries that share keywords (excluding the current entry)
  const related = allEntries.filter(other => {
    if (other.id === entry.id) return false;
    
    const sharedKeywords = entry.keywords.filter(k => 
      other.keywords.some(ok => ok.toLowerCase() === k.toLowerCase())
    );
    
    return sharedKeywords.length > 0;
  });
  
  // Sort by number of shared keywords (descending), then by date
  return related
    .sort((a, b) => {
      const aShared = entry.keywords.filter(k => 
        a.keywords.some(ak => ak.toLowerCase() === k.toLowerCase())
      ).length;
      
      const bShared = entry.keywords.filter(k => 
        b.keywords.some(bk => bk.toLowerCase() === k.toLowerCase())
      ).length;
      
      if (bShared !== aShared) return bShared - aShared;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/**
 * Format date in readable format
 */
export function formatResearchDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get citation in specified format
 */
export function getCitationInFormat(
  citation: string, 
  format: 'APA' | 'MLA' | 'BibTeX' = 'APA'
): string {
  switch (format) {
    case 'MLA':
      return formatMLA(citation);
    case 'BibTeX':
      return formatBibTeX(citation);
    case 'APA':
    default:
      return formatAPA(citation);
  }
}
