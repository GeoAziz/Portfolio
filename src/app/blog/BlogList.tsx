'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

interface BlogListProps {
  allPosts: Array<{
    slug: string;
    metadata: {
      title: string;
      date: string;
      summary: string;
      draft?: boolean;
      tags?: string[];
      type?: string;
      keyInsight?: string;
    };
  }>;
}

export default function BlogList({ allPosts }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    return Array.from(new Set(allPosts.flatMap(p => p.metadata.tags || [])));
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return allPosts;
    }
    return allPosts.filter(post => post.metadata.tags?.includes(selectedTag));
  }, [allPosts, selectedTag]);

  return (
    <section className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTag(tag)}
            className="font-mono"
          >
            {tag}
          </Button>
        ))}
        {selectedTag && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedTag(null)}>
            Clear Filter
          </Button>
        )}
      </div>

      <div className="grid gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
            .map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
                <Card className="bg-card border-border hover:border-accent/50 transition-colors duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                        {post.metadata.type && (
                            <Badge variant="default" className="font-mono text-xs">
                                {post.metadata.type}
                            </Badge>
                        )}
                        <p className="text-sm text-muted-foreground">{format(new Date(post.metadata.date), 'MMMM d, yyyy')}</p>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-headline group-hover:text-accent transition-colors pt-2">{post.metadata.title}</CardTitle>
                    <CardDescription className="pt-4 font-body text-base text-muted-foreground">
                        <span className='font-semibold text-foreground'>Key Insight:</span> {post.metadata.keyInsight || post.metadata.summary}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {post.metadata.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-mono text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{selectedTag ? `No posts found with the tag "${selectedTag}".` : 'No posts yet. The journal is being written.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
