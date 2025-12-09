import { getBlogPost } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { MotionFade } from '@/components/MotionFade';
import { format } from 'date-fns';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) {
    return;
  }

  return {
    title: `${post.metadata.title} | Systems Journal`,
    description: post.metadata.summary,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <MotionFade>
      <article className="prose prose-lg dark:prose-invert mx-auto py-12">
        <header className="mb-8 text-center border-b border-border pb-8">
          <h1 className="!text-4xl md:!text-5xl font-headline !mb-2">{post.metadata.title}</h1>
          <p className="text-muted-foreground text-base">
            {format(new Date(post.metadata.date), 'MMMM d, yyyy')}
          </p>
        </header>
        <div className="prose-p:text-foreground/90 prose-headings:text-foreground prose-strong:text-foreground">
            {post.content}
        </div>
      </article>
    </MotionFade>
  );
}
