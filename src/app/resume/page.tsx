
import { SectionHeader } from '@/components/SectionHeader';
import { resumeData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';

export default function ResumePage() {
  return (
    <MotionFade>
      <div className="space-y-12 max-w-3xl mx-auto">
        <SectionHeader title="Professional Timeline" />
        
        <div className="space-y-12">
          {resumeData.experience.map((job) => (
            <div key={job.company} className="relative pl-8">
              <div className="absolute left-0 top-1 h-full w-px bg-border"></div>
              <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-accent"></div>

              <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-headline font-bold text-foreground">{job.role}</h3>
                <p className="text-sm text-muted-foreground">{job.period}</p>
              </div>
              <p className="text-md font-medium text-foreground/80 mb-4">{job.company}</p>

              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {job.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
