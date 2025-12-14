import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const BLOG_JSON = path.join(CONTENT_DIR, 'blog-posts.json');
const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface StoredBlogPost {
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
  contentPath?: string;
}

/** Read blog posts from the JSON store. Falls back to an empty array when missing. */
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

/** Load MDX content for a post if present at src/content/blog/<slug>.mdx */
export function loadPostContent(slug: string): string | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
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

// --- MDX helpers used by the post page
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getBlogPosts(): any[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const fileNames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = fileNames
    .map((fileName) => {
      try {
        const slug = fileName.replace(/\.mdx?$/, '');
        const fullPath = path.join(POSTS_DIR, fileName);
        const raw = fs.readFileSync(fullPath, 'utf8');
        const parsed = matter(raw);
        const readingTime = calculateReadingTime(parsed.content || '');

        return {
          slug,
          metadata: {
            title: parsed.data.title || '',
            date: parsed.data.date || '',
            summary: parsed.data.summary || parsed.data.keyInsight || '',
            tags: parsed.data.tags || [],
            draft: parsed.data.draft || false,
            type: parsed.data.type || parsed.data.category || '',
            keyInsight: parsed.data.keyInsight || parsed.data.summary || '',
            author: parsed.data.author || 'GeoAziz',
          },
          content: parsed.content,
          readingTime,
          featured: parsed.data.featured || false,
          image: parsed.data.image,
        };
      } catch (err) {
        console.error('Failed to parse post', fileName, err);
        return null;
      }
    })
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

  return posts as any[];
}

export function getBlogPost(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const readingTime = calculateReadingTime(parsed.content || '');

    if (process.env.NODE_ENV !== 'development' && parsed.data.draft) return null;

    return {
      slug,
      metadata: {
        title: parsed.data.title || '',
        date: parsed.data.date || '',
        summary: parsed.data.summary || parsed.data.keyInsight || '',
        tags: parsed.data.tags || [],
        draft: parsed.data.draft || false,
        type: parsed.data.type || parsed.data.category || '',
        keyInsight: parsed.data.keyInsight || parsed.data.summary || '',
        author: parsed.data.author || 'GeoAziz',
      },
      content: parsed.content,
      readingTime,
      featured: parsed.data.featured || false,
      image: parsed.data.image,
    };
  } catch (err) {
    console.error('Failed to read blog post', slug, err);
    return null;
  }
}
// (Optional helpers like table-of-contents can be added later if needed)
