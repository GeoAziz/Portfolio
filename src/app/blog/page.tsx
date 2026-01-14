import { getAllPosts } from '@/lib/blog';
import { MotionFade } from '@/components/MotionFade';
import BlogList from './BlogList';
import CorePhilosophies from '@/components/home/CorePhilosophies';
import ResearchHub from '@/components/home/ResearchHub';
import philosophyData from '@/data/philosophy.json';
import researchAreas from '@content/research.json';

export const metadata = {
  title: 'Blog | Systems Journal',
  description: 'A collection of field notes, research, and reflections on engineering, AI, and systems thinking.',
};

export default function BlogPage() {
  // Use the JSON-backed posts (seeded at src/content/blog-posts.json)
  const rawPosts = getAllPosts();

  // Map to the shape expected by BlogList (metadata wrapper)
  const allPosts = rawPosts.map((p) => ({
    slug: p.slug,
    metadata: {
      title: p.title || '',
      date: p.date || '',
      summary: p.summary || '',
      draft: false,
      tags: p.tags || [],
      type: '',
      keyInsight: p.summary || '',
      author: 'GeoAziz',
    },
    readingTime: undefined,
  }));

  const mappedResearchAreas = researchAreas.map((r: any) => ({
    area: r.title,
    focus: r.summary,
    keywords: [r.publication || '', r.date || ''],
  }));

  return (
    <MotionFade>
      <div className="space-y-12" data-testid="blog-container">
        <div className="text-center max-w-4xl mx-auto pt-8">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground" data-testid="blog-title">
            Systems Journal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Field notes, research, and reflections on engineering, AI, and systems thinking.
          </p>
        </div>

        <CorePhilosophies philosophies={philosophyData.philosophies} />
        <ResearchHub researchAreas={mappedResearchAreas} />

        <div className="border-t border-border/50 my-12"></div>

        <h2 className="text-2xl font-headline text-center text-primary">Journal Entries</h2>
        <BlogList allPosts={allPosts} />
      </div>
    </MotionFade>
  );
}

