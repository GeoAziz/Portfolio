'use client';

import { notFound } from 'next/navigation';
import { getResearchBySlug, getResearchDetails, formatResearchDate, getRelatedResearch, getCitationInFormat } from '@/lib/research';
import { MotionFade } from '@/components/MotionFade';
import { BackToTop } from '@/components/BackToTop';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Users, Zap, FileText, Download, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateResearchSchema } from '@/lib/seo';

interface ResearchDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const research = getResearchBySlug(params.slug);
  const details = research ? getResearchDetails(research.id) : undefined;
  const relatedResearch = research ? getRelatedResearch(research, 3) : [];

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<'APA' | 'MLA' | 'BibTeX'>('APA');

  if (!research || !details) {
    notFound();
  }

  const handleCopyCitation = (format: 'APA' | 'MLA' | 'BibTeX') => {
    const citation = research.citations[0] || '';
    const formatted = getCitationInFormat(citation, format);
    navigator.clipboard.writeText(formatted);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const statusColors = {
    'ongoing': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'concluded': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'in revision': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  };

  return (
    <MotionFade>
      <article className="max-w-4xl mx-auto space-y-12">
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateResearchSchema({
              title: research.title,
              abstract: research.abstract,
              date: research.date,
              authors: research.authors,
              keywords: research.keywords,
              publication: research.publication,
              doi: research.doi,
              pdfLink: research.pdfLink,
              slug: research.slug,
            }),
          }}
        />
        {/* Header Section */}
        <header className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-research" />
            <span className="text-sm text-muted-foreground">Research Entry</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {research.title}
          </h1>

          <p className="text-xl text-muted-foreground italic">
            {research.question}
          </p>

          {/* Metadata Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-border">
            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold">Status</p>
              <Badge className={`mt-2 capitalize ${statusColors[research.status]}`}>
                {research.status}
              </Badge>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold">Publication</p>
              <p className="mt-2 text-sm font-medium text-foreground">{research.publication}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold">Date</p>
              <p className="mt-2 text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatResearchDate(research.date)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold">Authors</p>
              <p className="mt-2 text-sm font-medium text-foreground flex items-center gap-1">
                <Users className="w-4 h-4" />
                {research.authors.length}
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {research.featuredImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border">
            <Image
              src={research.featuredImage}
              alt={research.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Abstract Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Abstract</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {research.abstract}
          </p>
        </section>

        {/* Research Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Motivation & Experiments */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent-research" />
                  Motivation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {details.motivation}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Experiments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.experiments.map((exp, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-accent-research font-bold min-w-[24px]">{idx + 1}.</span>
                      <span className="text-muted-foreground">{exp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Findings & Future */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.findings.map((finding, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-accent-research font-bold min-w-[24px]">✓</span>
                      <span className="text-muted-foreground">{finding}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Future Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.future.map((future, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-accent-research font-bold min-w-[24px]">→</span>
                      <span className="text-muted-foreground">{future}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Keywords */}
        <section className="space-y-4 border-t border-b border-border py-8">
          <h3 className="text-lg font-bold text-foreground">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {research.keywords.map(keyword => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </section>

        {/* Citations Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">References</h2>
            <div className="space-y-2 mb-6">
              <div className="flex gap-2">
                {(['APA', 'MLA', 'BibTeX'] as const).map(format => (
                  <Button
                    key={format}
                    variant={selectedCitationFormat === format ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCitationFormat(format)}
                    className="text-xs"
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {research.citations.map((citation, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-4 space-y-3"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getCitationInFormat(citation, selectedCitationFormat)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCitation(selectedCitationFormat)}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedFormat === selectedCitationFormat ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOI & PDF Links */}
        {(research.doi || research.pdfLink) && (
          <section className="flex gap-4 border-t border-border pt-8">
            {research.doi && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://doi.org/${research.doi}`, '_blank')}
              >
                <FileText className="w-4 h-4" />
                DOI: {research.doi}
              </Button>
            )}
            {research.pdfLink && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(research.pdfLink, '_blank')}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            )}
          </section>
        )}

        {/* Related Research */}
        {relatedResearch.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground">Related Research</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedResearch.map(related => (
                <a
                  key={related.id}
                  href={`/research/${related.slug}`}
                  className="group bg-card border border-border rounded-lg p-4 hover:border-accent-research/50 transition-colors duration-300"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-accent-research transition-colors mb-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {related.summary}
                  </p>
                  <div className="mt-3 flex gap-1 flex-wrap">
                    {related.keywords.slice(0, 2).map(k => (
                      <Badge key={k} variant="secondary" className="text-xs">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>

      <BackToTop />
    </MotionFade>
  );
}
