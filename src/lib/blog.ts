import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'blog');

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

      return {
        slug,
        metadata: matterResult.data as { title: string; date: string; summary: string; draft?: boolean },
      };
    })
    .filter(post => process.env.NODE_ENV === 'development' || !post.metadata.draft);
    
  return allPostsData;
}

export function getBlogPost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (process.env.NODE_ENV !== 'development' && data.draft) {
      return null;
    }
    
    return {
        metadata: data as { title: string; date: string; summary: string; draft?: boolean },
        content: content,
        slug,
    };
}
