
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { projectsData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function OpenSourcePage() {
  const osProjects = projectsData.filter(p => p.openSource === true);
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Open Source Contributions" />
        <div className="grid gap-6 md:gap-8">
          {osProjects.map(project => (
            <ProjectInspector key={project.name} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
