
import { SectionHeader } from '@/components/SectionHeader';
import { researchData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

export default function ResearchPage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Research & Writing" />
        <div className="grid gap-8 max-w-4xl mx-auto">
          {researchData.map((item) => (
            <Card key={item.title} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-headline">
                   <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:text-accent"
                  >
                    {item.title}
                    <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" />
                  </a>
                </CardTitle>
                <CardDescription className="text-muted-foreground pt-1">
                  Published in <em>{item.publication}</em> on {item.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{item.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
