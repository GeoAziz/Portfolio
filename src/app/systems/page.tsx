
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { systemsData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

export default function SystemsPage() {
  const { systems_intro, systems_skills, systems_projects } = systemsData;

  return (
    <MotionFade>
      <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
             <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
                <Cpu className="w-10 h-10 text-accent-systems" /> {systems_intro.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                {systems_intro.subtitle}
            </p>
            <p className="mt-4 text-md text-muted-foreground/80">
                {systems_intro.description}
            </p>
        </div>
        
        <section>
          <SectionHeader title="System Skill Matrix" />
          <Card className="bg-card border-border mt-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-center gap-2">
                {systems_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-md py-1 px-3 font-mono">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader title="Systems Projects" />
          <div className="grid gap-6 md:gap-8 mt-8">
            {systems_projects.map(project => (
              <ProjectInspector key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </MotionFade>
  );
}
