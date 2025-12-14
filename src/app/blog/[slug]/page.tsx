import { getBlogPost } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { MotionFade } from '@/components/MotionFade';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/mdx/MDXComponents';
import { generateArticleSchema, generateBreadcrumbSchema, generateCanonicalUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) {
    return notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(post.metadata.title)}&description=${encodeURIComponent(post.metadata.summary)}`;

  return {
    title: `${post.metadata.title} | Systems Journal`,
    description: post.metadata.summary,
    keywords: post.metadata.tags,
    canonical: canonicalUrl,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: 'article',
      url: canonicalUrl,
      images: [ogImage],
      authors: [post.metadata.author || 'Geo Aziz'],
      publishedTime: post.metadata.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.summary,
      creator: '@geoaziz',
      images: [ogImage],
    },
    articlePublishedTime: post.metadata.date,
    articleModifiedTime: post.metadata.date,
    articleAuthor: post.metadata.author || 'Geo Aziz',
    articleSection: post.metadata.type || 'Systems',
    articleTag: post.metadata.tags,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geoaziz.com';
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;
  
  // Generate Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description: post.metadata.summary,
    datePublished: post.metadata.date,
    dateModified: post.metadata.date,
    author: {
      '@type': 'Person',
      name: post.metadata.author || 'Geo Aziz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Geo Aziz - Systems Journal',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: canonicalUrl,
    keywords: post.metadata.tags?.join(', '),
    articleSection: post.metadata.type || 'Systems',
  };

  // Generate Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.metadata.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <MotionFade>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        suppressHydrationWarning
      />
      <article className="prose prose-lg dark:prose-invert mx-auto py-12">
        <header className="mb-8 text-center border-b border-border pb-8">
          <h1 className="!text-4xl md:!text-5xl font-headline !mb-2">{post.metadata.title}</h1>
          <div className="flex items-center justify-center gap-2 flex-wrap text-muted-foreground text-sm">
            <p>{format(new Date(post.metadata.date), 'MMMM d, yyyy')}</p>
            {post.readingTime && (
              <>
                <span>•</span>
                <p>{post.readingTime} min read</p>
              </>
            )}
            {post.metadata.author && (
              <>
                <span>•</span>
                <p>by {post.metadata.author}</p>
              </>
            )}
          </div>
        </header>
        <div className="prose-p:text-foreground/90 prose-headings:text-foreground prose-strong:text-foreground">
          <MDXRemote source={post.content} components={MDXComponents as any} />
        </div>
      </article>
    </MotionFade>
  );
}
