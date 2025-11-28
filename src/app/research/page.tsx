
import { SectionHeader } from '@/components/SectionHeader';
import { researchData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, BookOpen, Lightbulb, TestTube } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ResearchPage() {
  const { researchEntries, researchDetails, learningLog } = researchData;

  return (
    <MotionFade>
      <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
                <TestTube className="w-10 h-10 text-accent-research" /> Research & Inquiry
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Documenting experiments, discoveries, hypotheses & evolving intellectual frameworks.
            </p>
             <p className="mt-4 text-md text-muted-foreground/80">
                This is where I explore technical questions, test assumptions, analyze systems, and share learnings from iterative experimentation.
            </p>
        </div>

        <section>
          <SectionHeader title="Research Entries" />
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto grid gap-4 mt-8">
            {researchEntries.map((item) => {
              const details = researchDetails[item.id];
              return (
                <AccordionItem value={item.id} key={item.id} asChild>
                    <Card className="bg-card border-border hover:border-accent-research/50 transition-colors duration-300">
                        <AccordionTrigger className="p-6 text-left w-full hover:no-underline">
                             <div className="flex-grow">
                                <CardTitle className="text-xl font-headline text-left">{item.title}</CardTitle>
                                <CardDescription className="text-muted-foreground pt-2 text-left italic">
                                    {item.question}
                                </CardDescription>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Badge variant="secondary" className="capitalize">{item.status}</Badge>
                                    {item.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="px-6 pb-6 grid md:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-4">
                                     <div>
                                        <h4 className="font-semibold mb-2 text-foreground">Motivation</h4>
                                        <p className="text-muted-foreground">{details?.motivation}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2 text-foreground">Experiments</h4>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {details?.experiments.map(exp => <li key={exp}>{exp}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                 <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2 text-foreground">Findings</h4>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {details?.findings.map(finding => <li key={finding}>{finding}</li>)}
                                        </ul>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold mb-2 text-foreground">Future Inquiries</h4>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {details?.future.map(fut => <li key={fut}>{fut}</li>)}
                                        </ul>
                                    </div>
                                </div>
                           </div>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        <section>
            <SectionHeader title="Learning Log" />
            <div className="max-w-3xl mx-auto space-y-6 mt-8">
                {learningLog.map((log, index) => (
                    <div key={index} className="bg-card border border-border/50 rounded-lg p-4 text-sm relative flex items-start gap-4">
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
