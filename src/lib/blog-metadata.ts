/**
 * Blog Post Metadata Extraction
 * Utility for extracting frontmatter and generating SEO metadata from MDX files
 */

import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { generateArticleSchema, generateSlug, generateExcerpt } from './seo';

export interface BlogFrontmatter {
  title: string;
  date: string;
  summary?: string;
  type?: string;
  keyInsight?: string;
  tags?: string[];
  author?: string;
  image?: string;
  featured?: boolean;
}

export interface BlogMetadata extends BlogFrontmatter {
  slug: string;
  excerpt: string;
  readingTime: number;
  content: string;
  schema: string;
  url: string;
}

/**
 * Extract metadata from a single blog post
 */
export function extractBlogMetadata(filePath: string, fileContent: string): BlogMetadata {
  const { data, content } = matter(fileContent);
  const frontmatter = data as BlogFrontmatter;

  // Generate slug from filename or title
  const fileName = path.basename(filePath, '.mdx');
  const slug = frontmatter.title ? generateSlug(frontmatter.title) : fileName;

  // Calculate reading time
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Generate excerpt
  const excerpt = generateExcerpt(frontmatter.summary || content, 160);

  // Generate JSON-LD schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devmahnx.com';
  const url = `${baseUrl}/blog/${slug}`;
  const schema = generateArticleSchema({
    title: frontmatter.title,
    description: frontmatter.summary || excerpt,
    image: frontmatter.image,
    datePublished: frontmatter.date,
    author: frontmatter.author || 'Mahnoor',
    canonicalUrl: url,
  });

  return {
    ...frontmatter,
    slug,
    excerpt,
    readingTime,
    content,
    schema,
    url,
  };
}

/**
 * Get all blog posts metadata
 */
export function getAllBlogMetadata(): BlogMetadata[] {
  const blogDir = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return extractBlogMetadata(filePath, fileContent);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get single blog post by slug
 */
export function getBlogBySlug(slug: string): BlogMetadata | null {
  const blogDir = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(blogDir)) {
    return null;
  }

  const files = fs.readdirSync(blogDir);
  const file = files.find((f) => f.endsWith('.mdx'));

  if (!file) {
    return null;
  }

  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const metadata = extractBlogMetadata(filePath, fileContent);

  return metadata.slug === slug ? metadata : null;
}

/**
 * Get blog posts by tag
 */
export function getBlogsByTag(tag: string): BlogMetadata[] {
  return getAllBlogMetadata().filter((post) => post.tags?.includes(tag));
}

/**
 * Get related blog posts
 */
export function getRelatedPosts(slug: string, limit: number = 3): BlogMetadata[] {
  const allPosts = getAllBlogMetadata();
  const currentPost = allPosts.find((p) => p.slug === slug);

  if (!currentPost) {
    return [];
  }

  const currentTags = currentPost.tags || [];
  const related = allPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const matchingTags = (post.tags || []).filter((tag) => currentTags.includes(tag)).length;
      return { post, score: matchingTags };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return related;
}
