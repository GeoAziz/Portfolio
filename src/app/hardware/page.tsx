
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { hardwareData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDrive } from 'lucide-react';

export default function HardwarePage() {
    const { hardwareProjects, componentInventory, skills, engineeringLog } = hardwareData;
  return (
    <MotionFade>
      <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
                <HardDrive className="w-10 h-10 text-accent" /> Hardware Engineering
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                From microcontrollers to sensors, circuits & real-world robotics.
            </p>
        </div>

        <section>
          <SectionHeader title="Hardware Projects" />
          <div className="grid gap-6 md:gap-8 mt-8">
            {hardwareProjects.map(project => (
              <ProjectInspector key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Component Inventory" />
            <Card className="bg-card border-border mt-8">
                <CardContent className="p-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {componentInventory.map((item) => (
                    <Badge key={item} variant="secondary" className="text-md py-1 px-3 font-mono">{item}</Badge>
                    ))}
                </div>
                </CardContent>
            </Card>
        </section>

        <section>
          <SectionHeader title="Core Hardware Skills" />
            <Card className="bg-card border-border mt-8">
                <CardContent className="p-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-md py-1 px-3 font-mono">{skill}</Badge>
                    ))}
                </div>
                </CardContent>
            </Card>
        </section>

        <section>
            <SectionHeader title="Engineering Logs" />
            <div className="max-w-3xl mx-auto space-y-6 mt-8">
                {engineeringLog.map((log, index) => (
                    <div key={index} className="bg-card border border-border/50 rounded-lg p-4 text-sm relative">
                        <p className="absolute -top-3 left-4 bg-card px-2 text-xs text-muted-foreground">{log.date}</p>
                        <p className="text-foreground/90 italic">{log.entry}</p>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </MotionFade>
  );
}
