
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { openSourceData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Github, GitFork, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function OpenSourcePage() {
  const { openSourceProjects, philosophy } = openSourceData;

  return (
    <MotionFade>
      <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
            <Github className="w-10 h-10 text-accent-opensource" /> Open Source
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Building tools, frameworks, and utilities that empower the community.
          </p>
           <p className="mt-4 text-md text-muted-foreground/80">
            Code is better when it’s shared. These are the repositories, tools & contributions I actively maintain or collaborate on.
          </p>
        </div>

        <section>
          <SectionHeader title="Projects & Contributions" />
          <div className="grid gap-6 md:gap-8 mt-8">
            {openSourceProjects.map(project => (
              <ProjectInspector key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section>
            <SectionHeader title="Tooling Philosophy" />
            <div className="max-w-3xl mx-auto mt-8 text-center">
                 <blockquote className="border-l-4 border-accent-opensource pl-6 text-xl md:text-2xl font-light text-foreground/90 italic text-left mb-8">
                    {philosophy.statement}
                 </blockquote>
                <div className="flex flex-wrap justify-center gap-2">
                    {philosophy.values.map((value) => (
                        <Badge key={value} variant="secondary" className="text-md py-1 px-3 font-mono">{value}</Badge>
                    ))}
                </div>
            </div>
        </section>

      </div>
    </MotionFade>
  );
}
