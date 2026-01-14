import Link from 'next/link';
import Image from 'next/image';
import { getAllCaseStudies } from '@/lib/caseStudies';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/SectionHeader';

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies().sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

  return (
    <MotionFade>
      <div className="space-y-12" data-testid="case-studies-page">
        <SectionHeader title="Case Studies" />
        <p data-testid="case-studies-description" className="text-muted-foreground max-w-3xl">
          Detailed breakdowns of selected projects — problem, architecture, implementation challenges, results, and lessons learned.
        </p>

        <div data-testid="case-studies-grid" className="grid md:grid-cols-2 gap-6">
          {studies.map(study => (
            <Card key={study.id} data-testid={`case-study-${study.slug}`} className="overflow-hidden">
              <Link href={`/case-studies/${study.slug}`} className="block">
                {study.screenshots && study.screenshots[0] && (
                  <div className="relative h-44 w-full">
                    <Image src={study.screenshots[0]} alt={study.title} fill className="object-cover" />
                  </div>
                )}

                <CardContent className="p-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                  </CardHeader>

                  <p className="text-sm text-muted-foreground mt-2">{study.problem}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{new Date(study.date || '').toLocaleDateString()}</p>
                    <p className="text-xs text-accent">Read case study →</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
