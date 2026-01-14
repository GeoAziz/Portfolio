
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
      <div className="space-y-16" data-testid="opensource-container">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4" data-testid="opensource-title">
            <Github className="w-10 h-10 text-accent-opensource" /> Open Source
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground" data-testid="opensource-subtitle">
            Building tools, frameworks, and utilities that empower the community.
          </p>
           <p className="mt-4 text-md text-muted-foreground/80" data-testid="opensource-description">
            Code is better when it's shared. These are the repositories, tools & contributions I actively maintain or collaborate on.
          </p>
        </div>

        <section data-testid="opensource-projects-section">
          <SectionHeader title="Projects & Contributions" />
          <div className="grid gap-6 md:gap-8 mt-8" data-testid="opensource-projects-grid">
            {openSourceProjects.map((project, index) => (
              <ProjectInspector key={project.id} project={project} data-testid={`opensource-project-${index}`} />
            ))}
          </div>
        </section>

        <section data-testid="opensource-philosophy-section">
            <SectionHeader title="Tooling Philosophy" />
            <div className="max-w-3xl mx-auto mt-8 text-center" data-testid="opensource-philosophy-content">
                 <blockquote className="border-l-4 border-accent-opensource pl-6 text-xl md:text-2xl font-light text-foreground/90 italic text-left mb-8" data-testid="opensource-philosophy-statement">
                    {philosophy.statement}
                 </blockquote>
                <div className="flex flex-wrap justify-center gap-2" data-testid="opensource-philosophy-values">
                    {philosophy.values.map((value) => (
                        <Badge key={value} variant="secondary" className="text-md py-1 px-3 font-mono" data-testid={`opensource-value-${value.toLowerCase().replace(/\s+/g, '-')}`}>{value}</Badge>
                    ))}
                </div>
            </div>
        </section>

      </div>
    </MotionFade>
  );
}
