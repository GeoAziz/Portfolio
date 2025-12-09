import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { format } from 'date-fns';

export const metadata = {
  title: 'Blog | Systems Journal',
  description: 'A collection of field notes, research, and reflections on engineering, AI, and systems thinking.',
};

export default function BlogPage() {
  const allPosts = getBlogPosts();

  return (
    <MotionFade>
       <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Systems Journal
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Field notes, research, and reflections on engineering, AI, and systems thinking.
            </p>
        </div>

        <section className="max-w-3xl mx-auto">
          <div className="grid gap-8">
            {allPosts
              .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
              .map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
                  <Card className="bg-card border-border hover:border-accent/50 transition-colors duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-headline group-hover:text-accent transition-colors">{post.metadata.title}</CardTitle>
                      <p className="text-sm text-muted-foreground pt-2">{format(new Date(post.metadata.date), 'MMMM d, yyyy')}</p>
                      <CardDescription className="pt-4">{post.metadata.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </MotionFade>
  );
}
