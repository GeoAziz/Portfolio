
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { projectsData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function SystemsPage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Software Systems" />
        <div className="grid gap-6 md:gap-8">
          {projectsData.map(project => (
            <ProjectInspector key={project.title} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
