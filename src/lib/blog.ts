import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

/**
 * Calculate reading time for blog post content
 * Assumes ~200 words per minute
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getBlogPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const readingTime = calculateReadingTime(matterResult.content);

      return {
        slug,
        metadata: matterResult.data as { 
          title: string; 
          date: string; 
          summary: string; 
          draft?: boolean; 
          tags?: string[];
          type?: string;
          keyInsight?: string;
          author?: string;
        },
        readingTime,
      };
    })
    .filter(post => process.env.NODE_ENV === 'development' || !post.metadata.draft)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    
  return allPostsData;
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
