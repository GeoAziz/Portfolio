import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getProjectForCaseStudy } from '@/lib/caseStudies';
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Params {
  params: { slug: string };
}

export default function CaseStudyDetail({ params }: Params) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return notFound();

  const project = getProjectForCaseStudy(study.projectRef);

  return (
    <MotionFade>
      <div className="max-w-4xl mx-auto space-y-8" data-testid="case-study-detail-page">
        <SectionHeader title={study.title} />

        {study.screenshots && study.screenshots.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {study.screenshots.map((src, i) => (
              <div key={i} className="relative h-48 w-full rounded overflow-hidden border border-border">
                <Image src={src} alt={`${study.title} screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <Card data-testid="case-study-problem">
            <CardHeader>
              <CardTitle>Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{study.problem}</p>
            </CardContent>
          </Card>

          <Card data-testid="case-study-solution">
            <CardHeader>
              <CardTitle>Solution & Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{study.solution}</p>
              {project && (
                <p className="text-sm mt-3 text-muted-foreground">
                  Related project: <Link href={`/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}`}>{project.title}</Link>
                </p>
              )}
            </CardContent>
          </Card>

          <Card data-testid="case-study-challenges">
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {study.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="case-study-results">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {study.results.map((r, i) => (
                  <li key={i} className="text-muted-foreground">
                    <strong className="text-foreground">{r.metric}:</strong> {r.value} {r.context ? <span className="text-sm text-muted-foreground">— {r.context}</span> : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="case-study-lessons">
            <CardHeader>
              <CardTitle>Lessons Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal pl-5 space-y-2 text-muted-foreground">
                {study.lessons.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MotionFade>
  );
}
