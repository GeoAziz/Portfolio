
'use client';

import { SectionHeader } from '@/components/SectionHeader';
import { researchData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BookOpen, Lightbulb, TestTube, Clock, Filter, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getReadTimeText } from '@/lib/readTime';
import { useState, useMemo } from 'react';
import {
  getAllResearchKeywords,
  getAllResearchYears,
  getAllResearchPublications,
  formatResearchDate,
} from '@/lib/research';
import Link from 'next/link';

export default function ResearchPage() {
  const { researchEntries, researchDetails, learningLog } = researchData;
  
  // Filter state
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Get filter options
  const allKeywords = useMemo(() => getAllResearchKeywords(), []);
  const allYears = useMemo(() => getAllResearchYears(), []);
  const allPublications = useMemo(() => getAllResearchPublications(), []);
  const statuses = ['ongoing', 'concluded', 'in revision'];

  // Filter entries
  const filteredEntries = useMemo(() => {
    return researchEntries.filter((entry: any) => {
      // Keyword filter
      if (selectedKeywords.length > 0) {
        const hasKeyword = selectedKeywords.some(k =>
          entry.keywords?.some((ek: string) => ek.toLowerCase() === k.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      // Year filter
      if (selectedYears.length > 0) {
        const entryYear = parseInt(entry.date.split('-')[0], 10);
        if (!selectedYears.includes(entryYear)) return false;
      }

      // Publication filter
      if (selectedPublications.length > 0) {
        if (!selectedPublications.includes(entry.publication)) return false;
      }

      // Status filter
      if (selectedStatus.length > 0) {
        if (!selectedStatus.includes(entry.status)) return false;
      }

      return true;
    });
  }, [selectedKeywords, selectedYears, selectedPublications, selectedStatus]);

  const handleToggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleToggleYear = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleTogglePublication = (pub: string) => {
    setSelectedPublications(prev =>
      prev.includes(pub)
        ? prev.filter(p => p !== pub)
        : [...prev, pub]
    );
  };

  const handleToggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedKeywords([]);
    setSelectedYears([]);
    setSelectedPublications([]);
    setSelectedStatus([]);
  };

  const hasActiveFilters =
    selectedKeywords.length > 0 ||
    selectedYears.length > 0 ||
    selectedPublications.length > 0 ||
    selectedStatus.length > 0;

  const statusColors = {
    'ongoing': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'concluded': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'in revision': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  };

  return (
    <MotionFade>
      <div data-testid="research-page" className="space-y-12">
        {/* Header */}
        <div data-testid="research-header" className="text-center max-w-4xl mx-auto">
          <h1 data-testid="research-title" className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
            <TestTube className="w-10 h-10 text-accent-research" /> Research & Inquiry
          </h1>
          <p data-testid="research-description" className="mt-4 text-lg md:text-xl text-muted-foreground">
            Documenting experiments, discoveries, hypotheses & evolving intellectual frameworks.
          </p>
          <p className="mt-4 text-md text-muted-foreground/80">
            This is where I explore technical questions, test assumptions, analyze systems, and share learnings from iterative experimentation.
          </p>
        </div>

        {/* Filters Section */}
        <section data-testid="research-filters" className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Research
            </h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-accent-research hover:bg-accent-research/10"
              >
                <X className="w-3 h-3 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Keywords Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Keywords</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {allKeywords.map(keyword => (
                  <label key={keyword} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedKeywords.includes(keyword)}
                      onChange={() => handleToggleKeyword(keyword)}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {keyword}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Year</h3>
              <div className="space-y-2">
                {allYears.map(year => (
                  <label key={year} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedYears.includes(year)}
                      onChange={() => handleToggleYear(year)}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {year}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Publication Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Publication</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {allPublications.map(pub => (
                  <label key={pub} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPublications.includes(pub)}
                      onChange={() => handleTogglePublication(pub)}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate">
                      {pub}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Status</h3>
              <div className="space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={() => handleToggleStatus(status)}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 p-4 bg-card border border-border rounded-lg">
              {selectedKeywords.map(k => (
                <Badge key={`kw-${k}`} variant="secondary" className="cursor-pointer" onClick={() => handleToggleKeyword(k)}>
                  {k} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedYears.map(y => (
                <Badge key={`yr-${y}`} variant="secondary" className="cursor-pointer" onClick={() => handleToggleYear(y)}>
                  {y} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedPublications.map(p => (
                <Badge key={`pub-${p}`} variant="secondary" className="cursor-pointer text-xs" onClick={() => handleTogglePublication(p)}>
                  {p.slice(0, 20)}... <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedStatus.map(s => (
                <Badge key={`status-${s}`} variant="secondary" className="cursor-pointer capitalize" onClick={() => handleToggleStatus(s)}>
                  {s} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {researchEntries.length} entries
          </p>
        </section>

        {/* Research Entries Grid */}
        <section className="space-y-6">
          <SectionHeader title={`Research Entries (${filteredEntries.length})`} />
          
          {filteredEntries.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredEntries.map((item: any) => {
                const details = researchDetails[item.id];
                return (
                  <Link key={item.id} href={`/research/${item.slug}`}>
                    <Card className="bg-card border-border hover:border-accent-research/50 transition-all duration-300 hover:shadow-md cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow">
                            <CardTitle className="text-xl font-headline line-clamp-2">
                              {item.title}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground pt-2 italic line-clamp-1">
                              {item.question}
                            </CardDescription>
                          </div>
                          {details && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              {getReadTimeText(
                                `${details.motivation} ${details.experiments.join(' ')} ${details.findings.join(' ')} ${details.future.join(' ')}`
                              )}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.abstract}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className={`capitalize ${statusColors[item.status as keyof typeof statusColors]}`}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {formatResearchDate(item.date)}
                          </Badge>
                          {item.keywords?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No research entries match your filters.</p>
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Learning Log Section */}
        <section className="space-y-6">
          <SectionHeader title="Learning Log" />
          <div className="max-w-3xl mx-auto space-y-6">
            {learningLog.map((log, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-lg p-4 text-sm relative flex items-start gap-4 hover:border-accent-research/50 transition-colors duration-300"
              >
                <Lightbulb className="w-4 h-4 text-accent-research/80 mt-1 flex-shrink-0" />
                <div>
                  <p className="absolute -top-3 left-4 bg-card px-2 text-xs text-muted-foreground">{log.date}</p>
                  <p className="text-foreground/90 italic">{log.entry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MotionFade>
  );
}
