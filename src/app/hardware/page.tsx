
import { ModelViewer } from '@/components/ModelViewer';
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { hardwareData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HardwarePage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Hardware & Firmware" />
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
          I believe in the tight integration of hardware and software to create seamless experiences. My approach is to design and build physical projects that are both functional and beautiful.
        </p>
        <div className="grid gap-8">
          {hardwareData.map((project, index) => (
            <div key={project.name} className="grid md:grid-cols-2 gap-8 items-start">
               <Card className={`bg-card border-border hover:border-accent/50 transition-colors duration-300 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <CardHeader>
                    <CardTitle className="text-xl font-headline mb-2">{project.name}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold mb-2 text-foreground">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map(tech => (
                        <Badge key={tech} variant="secondary" className="bg-surface-lighter text-accent-2-DEFAULT">{tech}</Badge>
                        ))}
                    </div>
                </CardContent>
               </Card>
              <div className="sticky top-20">
                <ModelViewer imageId={project.image} alt={project.name} modelSrc={project.model} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
