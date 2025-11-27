
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { opensourceData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function OpenSourcePage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Open Source Contributions" />
        <div className="grid gap-6 md:gap-8">
          {opensourceData.map(project => (
            <ProjectInspector key={project.title} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
