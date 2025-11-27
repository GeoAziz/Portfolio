
import { identityData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { SkillOrbit } from '@/components/SkillOrbit';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-24">
      <MotionFade>
        <section className="mt-16 md:mt-24 space-y-6 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            {identityData.statement}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {identityData.role}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/systems">View Systems</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/resume">View Resume</Link>
            </Button>
          </div>
        </section>
      </MotionFade>

      <section className="w-full max-w-6xl">
        <SectionHeader title="Core Competencies" />
        <div className="mt-8">
          <SkillOrbit />
        </div>
      </section>

      <section className="w-full max-w-5xl text-center">
        <SectionHeader title="Explore My Work" />
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 mb-8">
          Dive into the different domains of my work, from software systems and AI to hardware and open-source contributions.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild><Link href="/systems">Systems</Link></Button>
            <Button variant="outline" asChild><Link href="/ai">AI</Link></Button>
            <Button variant="outline" asChild><Link href="/hardware">Hardware</Link></Button>
            <Button variant="outline" asChild><Link href="/research">Research</Link></Button>
            <Button variant="outline" asChild><Link href="/open-source">Open Source</Link></Button>
            <Button variant="outline" asChild><Link href="/resume">Resume</Link></Button>
        </div>
      </section>
    </div>
  );
}
