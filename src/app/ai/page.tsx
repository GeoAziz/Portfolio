
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { aiData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function AiPage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="AI / ML Systems" />
        <div className="grid gap-6 md:gap-8">
          {aiData.map(project => (
            <ProjectInspector key={project.title} project={project} />
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
