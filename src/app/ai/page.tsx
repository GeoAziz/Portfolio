
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { projectsData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function AiPage() {
  const aiProjects = projectsData.filter(p => p.category === 'AI');
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="AI / ML Systems" />
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
            My focus in AI is on experimentation and rapid prototyping. I enjoy exploring new models and techniques to build intelligent and useful applications.
        </p>
        <div className="grid gap-6 md:gap-8">
          {aiProjects.map(project => (
            <ProjectInspector key={project.name} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
