
import { ModelViewer } from '@/components/ModelViewer';
import { ProjectInspector } from '@/components/ProjectInspector';
import { SectionHeader } from '@/components/SectionHeader';
import { hardwareData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function HardwarePage() {
  return (
    <MotionFade>
      <div className="space-y-12">
        <SectionHeader title="Hardware & Firmware" />
        <div className="grid gap-8">
          {hardwareData.map(project => (
            <div key={project.title} className="grid md:grid-cols-2 gap-8 items-start">
              <ProjectInspector project={project} />
              <div className="sticky top-20">
                <ModelViewer imageId={project.image} alt={project.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
