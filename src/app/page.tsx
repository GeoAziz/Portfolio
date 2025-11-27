
import { identityData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { SkillOrbit } from '@/components/SkillOrbit';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-24">
      <MotionFade>
        <section className="mt-16 md:mt-24 space-y-4 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            {identityData.statement}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {identityData.role}
          </p>
        </section>
      </MotionFade>

      <section className="w-full max-w-6xl">
        <SectionHeader title="Core Competencies" />
        <div className="mt-8">
          <SkillOrbit />
        </div>
      </section>
    </div>
  );
}
