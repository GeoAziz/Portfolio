
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { projectsData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function SystemsPage() {
  const systemsProjects = projectsData.filter(p => p.category === 'Systems');
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Software Systems" />
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
          My philosophy for building systems is centered around modularity, scalability, and innovation. I strive to create robust and elegant solutions for complex problems.
        </p>
        <div className="grid gap-6 md:gap-8">
          {systemsProjects.map(project => (
            <ProjectInspector key={project.name} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
