import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const BLOG_JSON = path.join(CONTENT_DIR, 'blog-posts.json');

export interface StoredBlogPost {
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
  contentPath?: string; // optional path to MDX file
}

/**
 * Read blog posts from the JSON store. Falls back to an empty array when missing.
 */
export function getAllPosts(): StoredBlogPost[] {
  try {
    if (!fs.existsSync(BLOG_JSON)) return [];
    const raw = fs.readFileSync(BLOG_JSON, 'utf8');
    return JSON.parse(raw) as StoredBlogPost[];
  } catch (err) {
    console.error('Failed to read blog posts:', err);
    return [];
  }
}

export function getPostBySlug(slug: string): StoredBlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Load MDX content for a post if present at src/content/blog/<slug>.mdx
 */
export function loadPostContent(slug: string): string | null {
  const mdxPath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`);
  try {
    if (!fs.existsSync(mdxPath)) return null;
    return fs.readFileSync(mdxPath, 'utf8');
  } catch (err) {
    console.error('Failed to load MDX for', slug, err);
    return null;
  }
}

export function savePosts(posts: StoredBlogPost[]) {
  try {
    if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
    fs.writeFileSync(BLOG_JSON, JSON.stringify(posts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save blog posts:', err);
    return false;
  }
}

export default { getAllPosts, getPostBySlug, loadPostContent, savePosts };
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

/**
 * Blog Post Interface with full metadata support
 */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  readingTime: number;
  featured: boolean;
  author: string;
  image?: string;
  keywords?: string[];
  relatedSlugs?: string[];
}

export type BlogCategory =
  | 'systems-thinking'
  | 'architecture'
  | 'ai-ethics'
  | 'distributed-systems'
  | 'hardware'
  | 'optimization'
  | 'complexity'
  | 'future';

/**
 * Calculate reading time for blog post content
 * Assumes ~200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get all blog posts sorted by date (newest first)
 * Returns both BlogPost format and legacy format for backwards compatibility
 */
export function getBlogPosts(): any[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const readingTime = calculateReadingTime(matterResult.content);

        // Support both old and new metadata formats
        const postData = {
          slug,
          metadata: {
            title: matterResult.data.title || '',
            date: matterResult.data.date || '',
            summary: matterResult.data.summary || '',
            tags: matterResult.data.tags || [],
            draft: matterResult.data.draft || false,
            type: matterResult.data.type || matterResult.data.category || '',
            keyInsight: matterResult.data.keyInsight || matterResult.data.summary || '',
            author: matterResult.data.author || 'GeoAziz',
          },
          content: matterResult.content,
          readingTime,
          featured: matterResult.data.featured || false,
          image: matterResult.data.image,
        };
        
        return postData;
      } catch (error) {
        console.error(`Error parsing blog post ${fileName}:`, error);
        return null;
      }
    })
    .filter(post => post !== null)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    
  return allPostsData;
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): any {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    const readingTime = calculateReadingTime(matterResult.content);

    // Support both old and new metadata formats
    return {
      slug,
      metadata: {
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        summary: matterResult.data.summary || '',
        tags: matterResult.data.tags || [],
        draft: matterResult.data.draft || false,
        type: matterResult.data.type || matterResult.data.category || '',
        keyInsight: matterResult.data.keyInsight || matterResult.data.summary || '',
        author: matterResult.data.author || 'GeoAziz',
      },
      content: matterResult.content,
      readingTime,
      featured: matterResult.data.featured || false,
      image: matterResult.data.image,
    };
  } catch (error) {
    console.error(`Error parsing blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get featured blog posts (limited to 3)
 */
export function getFeaturedBlogPosts(limit = 3): any[] {
  const posts = getBlogPosts();
  return posts.filter(post => post.featured).slice(0, limit);
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(category: string): any[] {
  const posts = getBlogPosts();
  return posts.filter(post => {
    const postCategory = post.metadata?.type || post.category || '';
    return postCategory === category;
  });
}

/**
 * Get all unique categories from blog posts
 */
export function getAllBlogCategories(): string[] {
  const posts = getBlogPosts();
  const categories = new Set<string>();
  posts.forEach(post => {
    const category = post.metadata?.type || post.category || '';
    if (category) categories.add(category);
  });
  return Array.from(categories);
}

/**
 * Get all unique tags from blog posts
 */
export function getAllBlogTags(): string[] {
  const posts = getBlogPosts();
  const tags = new Set<string>();
  posts.forEach(post => {
    const postTags = post.metadata?.tags || post.tags || [];
    (postTags as string[]).forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags);
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): any[] {
  const posts = getBlogPosts();
  return posts.filter(post => {
    const postTags = post.metadata?.tags || post.tags || [];
    return (postTags as string[]).includes(tag);
  });
}

/**
 * Get related blog posts based on tags and category
 */
export function getRelatedBlogPosts(slug: string, limit = 3): any[] {
  const currentPost = getBlogPostBySlug(slug);
  if (!currentPost) return [];

  const allPosts = getBlogPosts();

  const scored = allPosts
    .filter(post => post.slug !== slug)
    .map(post => {
      let score = 0;

      // Get current post details
      const currentCategory = (currentPost as any).metadata?.type || (currentPost as any).category || '';
      const currentTags = (currentPost as any).metadata?.tags || (currentPost as any).tags || [];
      
      // Get post details
      const postCategory = (post as any).metadata?.type || (post as any).category || '';
      const postTags = (post as any).metadata?.tags || (post as any).tags || [];

      // Bonus for same category
      if (postCategory === currentCategory) score += 3;

      // Bonus for shared tags
      const sharedTags = (postTags as string[]).filter((tag: string) =>
        (currentTags as string[]).includes(tag)
      );
      score += sharedTags.length * 2;

      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return scored;
}

/**
 * Generate table of contents from markdown headings
 */
export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export function generateTableOfContents(content: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2];
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ id, title, level });
  }

  return toc;
}

export function getBlogPost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const readingTime = calculateReadingTime(content);

    if (process.env.NODE_ENV !== 'development' && data.draft) {
      return null;
    }
    
    return {
        metadata: data as { 
          title: string; 
          date: string; 
          summary: string; 
          draft?: boolean; 
          tags?: string[];
          type?: string;
          keyInsight?: string;
          author?: string;
        },
        content: content,
        slug,
        readingTime,
    };
}
