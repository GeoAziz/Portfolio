
'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import { SkillOrbit } from '@/components/SkillOrbit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { projectsData } from '@/lib/content';
import { Code, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const competencies = [
  {
    icon: HardDrive,
    title: 'Systems Engineering',
    description: 'I design and build stable, scalable, high-performance architectures.',
    color: 'text-accent-systems',
  },
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'I experiment with models, agents, and intelligent automation.',
     color: 'text-accent-ai',
  },
  {
    icon: Code,
    title: 'Hardware & Embedded',
    description: 'I work with electronics, microcontrollers, and physical-digital interfaces.',
    color: 'text-accent-hardware',
  },
];

const featuredProjects = projectsData.filter(p => ["CYGNUS", "NEURA-LINK", "QUANTUM CORE"].includes(p.name));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-24 md:space-y-32">
      {/* Section 1: Hero */}
      <motion.section
        className="mt-16 md:mt-24 space-y-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground"
          variants={itemVariants}
        >
          Engineer Dev Mahn X
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Building intelligent systems — from silicon to software.
        </motion.p>
        <motion.p
          className="text-md md:text-lg text-muted-foreground/80 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Exploring the boundaries of computation, intelligence, and engineered systems.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          variants={itemVariants}
        >
          {[
            { href: '#systems', label: 'Explore the Work', variant: 'outline' },
            { href: '/resume', label: 'Contact / Collaborate', variant: 'default' },
          ].map((btn) => (
            <motion.div
              key={btn.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" variant={btn.variant as any}>
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Section 2: SkillOrbit */}
      <motion.section
        className="w-full max-w-6xl py-12 md:py-20"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader title="Cognitive Skill Map" />
        </motion.div>
        <div className="mt-8">
          <SkillOrbit />
        </div>
      </motion.section>

      {/* Section 3: Core Competency Snapshot */}
      <motion.section
        className="w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {competencies.map((competency, index) => (
            <motion.div
              key={competency.title}
              initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? 30 : 0 }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1] as const,
                },
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-all duration-300 group cursor-pointer"
            >
              <motion.div
                className="bg-secondary p-3 rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <competency.icon className={cn("w-6 h-6", competency.color)} />
              </motion.div>
              <div>
                <h3 className="text-lg font-headline font-semibold text-foreground group-hover:text-accent transition-colors">{competency.title}</h3>
                <p className="text-muted-foreground mt-1">{competency.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 4: Featured Projects Preview */}
      <motion.section
        id="systems"
        className="w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SectionHeader title="Featured Projects" />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          variants={containerVariants}
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.name}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border text-left hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-headline group-hover:text-accent transition-colors">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Section 5: Identity Statement */}
      <motion.section
        className="w-full max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={slideInLeft}
      >
        <motion.blockquote
          className="border-l-4 border-accent pl-6 text-xl md:text-2xl font-light text-foreground/90 italic text-left"
          whileHover={{ x: 10 }}
          transition={{ duration: 0.3 }}
        >
          I build systems with a scientist's curiosity and an engineer's discipline. I enjoy working at the boundary where abstract intelligence meets physical computation. I believe in learning through building — whether in simulation or on silicon.
        </motion.blockquote>
      </motion.section>

      {/* Section 6: Navigation into the Universe */}
      <motion.section
        className="w-full max-w-5xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SectionHeader title="Explore The Universe" />
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 mb-8"
          variants={itemVariants}
        >
          Each section is a domain within my information architecture.
        </motion.p>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {[
            { href: '/systems', label: 'Systems' },
            { href: '/ai', label: 'AI' },
            { href: '/hardware', label: 'Hardware' },
            { href: '/research', label: 'Research' },
            { href: '/open-source', label: 'Open Source' },
            { href: '/resume', label: 'Resume' },
          ].map((nav) => (
            <motion.div
              key={nav.href}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" asChild size="lg" className="w-full">
                <Link href={nav.href}>{nav.label} &rarr;</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
