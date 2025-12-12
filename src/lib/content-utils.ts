import { z } from 'zod';

/**
 * Calculate reading time in minutes for a given text
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extract a brief excerpt from text (first ~150 chars)
 */
export function extractExcerpt(text: string, length: number = 150): string {
  const cleaned = text.replace(/[\n\r]+/g, ' ').trim();
  if (cleaned.length <= length) return cleaned;
  return cleaned.substring(0, length).trim() + '...';
}

/**
 * Generate a URL-safe slug from a title
 * Example: "Hello World!" -> "hello-world"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

/**
 * Metadata validation schemas
 */

export const BlogMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  categories: z.array(z.string()).optional(),
  author: z.string().optional().default('Geo Aziz'),
  featured: z.boolean().optional().default(false),
  readingTime: z.number().optional(),
  slug: z.string().optional(),
  ogImage: z.string().optional(),
  description: z.string().optional(),
});

export const ProjectMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  name: z.string().min(1, 'Project name is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().optional(),
  tech: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.enum(['Systems', 'AI', 'Hardware', 'Web']),
  featured: z.boolean().optional().default(false),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
});

export const ResearchMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  publication: z.string().min(1, 'Publication is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  abstract: z.string().min(20, 'Abstract must be at least 20 characters'),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
});

export type BlogMetadata = z.infer<typeof BlogMetadataSchema>;
export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
export type ResearchMetadata = z.infer<typeof ResearchMetadataSchema>;

/**
 * Validate and enrich content metadata
 */
export function validateAndEnrichBlogMetadata(metadata: any): BlogMetadata {
  try {
    const validated = BlogMetadataSchema.parse(metadata);
    return {
      ...validated,
      slug: validated.slug || generateSlug(validated.title),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Metadata validation failed:\n${messages}`);
    }
    throw error;
  }
}

export function validateProjectMetadata(metadata: any): ProjectMetadata {
  try {
    return ProjectMetadataSchema.parse(metadata);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Project metadata validation failed:\n${messages}`);
    }
    throw error;
  }
}

export function validateResearchMetadata(metadata: any): ResearchMetadata {
  try {
    return ResearchMetadataSchema.parse(metadata);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Research metadata validation failed:\n${messages}`);
    }
    throw error;
  }
}

/**
 * Aggregate content statistics
 */
export function getContentStats(allContent: any[]) {
  return {
    total: allContent.length,
    featured: allContent.filter(c => c.featured).length,
    avgReadingTime: allContent.reduce((sum, c) => sum + (c.readingTime || 0), 0) / allContent.length || 0,
    tags: [...new Set(allContent.flatMap(c => c.tags || []))].length,
    categories: [...new Set(allContent.flatMap(c => c.categories || []))].length,
  };
}
