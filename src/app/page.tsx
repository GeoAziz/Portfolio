
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { SkillOrbit } from '@/components/SkillOrbit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { projectsData } from '@/lib/content';
import { Code, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';

const competencies = [
  {
    icon: HardDrive,
    title: 'Systems Engineering',
    description: 'I design and build stable, scalable, high-performance architectures.',
  },
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'I experiment with models, agents, and intelligent automation.',
  },
  {
    icon: Code,
    title: 'Hardware & Embedded',
    description: 'I work with electronics, microcontrollers, and physical-digital interfaces.',
  },
];

const featuredProjects = projectsData.filter(p => ["CYGNUS", "NEURA-LINK", "QUANTUM CORE"].includes(p.name));


export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-24 md:space-y-32">
      {/* Section 1: Hero */}
      <MotionFade>
        <section className="mt-16 md:mt-24 space-y-6 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground">
            Engineer Dev Mahn X
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Building intelligent systems — from silicon to software.
          </p>
           <p className="text-md md:text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Exploring the boundaries of computation, intelligence, and engineered systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" variant="outline">
              <Link href="#systems">Explore the Work</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/resume">Contact / Collaborate</Link>
            </Button>
          </div>
        </section>
      </MotionFade>

      {/* Section 2: Core Competency Snapshot */}
      <section className="w-full max-w-5xl">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {competencies.map((competency) => (
            <div key={competency.title} className="flex items-start gap-4">
              <div className="bg-secondary p-3 rounded-full">
                <competency.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-headline font-semibold text-foreground">{competency.title}</h3>
                <p className="text-muted-foreground mt-1">{competency.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: SkillOrbit */}
      <section className="w-full max-w-6xl">
        <SectionHeader title="Cognitive Skill Map" />
        <div className="mt-8">
          <SkillOrbit />
        </div>
      </section>

      {/* Section 4: Featured Projects Preview */}
      <section id="systems" className="w-full max-w-5xl">
        <SectionHeader title="Featured Projects" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {featuredProjects.map((project) => (
             <Card key={project.name} className="bg-card border-border text-left hover:border-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Section 5: Identity Statement */}
      <section className="w-full max-w-3xl">
          <blockquote className="border-l-4 border-accent pl-6 text-xl md:text-2xl font-light text-foreground/90 italic text-left">
            I build systems with a scientist’s curiosity and an engineer’s discipline. I enjoy working at the boundary where abstract intelligence meets physical computation. I believe in learning through building — whether in simulation or on silicon.
          </blockquote>
      </section>

      {/* Section 6: Navigation into the Universe */}
      <section className="w-full max-w-5xl text-center">
        <SectionHeader title="Explore The Universe" />
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 mb-8">
          Each section is a domain within my information architecture.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild size="lg"><Link href="/systems">Systems &rarr;</Link></Button>
            <Button variant="outline" asChild size="lg"><Link href="/ai">AI &rarr;</Link></Button>
            <Button variant="outline" asChild size="lg"><Link href="/hardware">Hardware &rarr;</Link></Button>
            <Button variant="outline" asChild size="lg"><Link href="/research">Research &rarr;</Link></Button>
            <Button variant="outline" asChild size="lg"><Link href="/open-source">Open Source &rarr;</Link></Button>
            <Button variant="outline" asChild size="lg"><Link href="/resume">Resume &rarr;</Link></Button>
        </div>
      </section>
    </div>
  );
}
