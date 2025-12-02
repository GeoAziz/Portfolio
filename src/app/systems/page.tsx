
'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import { TechStackTile, TechStackTileProps } from '@/components/TechStackTile';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { CapabilityCard } from '@/components/CapabilityCard';
import { LiveTelemetry } from '@/components/LiveTelemetry';
import { PhilosophyCard } from '@/components/PhilosophyCard';
import techStackData from '@/data/tech-stack.json';
import capabilitiesData from '@/data/capabilities.json';
import philosophyData from '@/data/philosophy.json';

const techStack = techStackData.techStack as TechStackTileProps[];
const { capabilities } = capabilitiesData;
const { philosophies } = philosophyData;

export default function SystemsPage() {
  return (
    <div className="flex flex-col items-center text-center space-y-24 md:space-y-32 mt-16 md:mt-24">
      {/* Section 1: Header */}
      <motion.section
        className="space-y-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
          System Architecture & Core Engine
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          An evolving multi-layer architecture powering development, intelligence, and automation.
        </p>
      </motion.section>

      {/* Section 2: System Architecture Diagram */}
      <section className="w-full max-w-6xl">
        <SectionHeader title="Architecture Diagram" />
        <div className="mt-8">
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Section 3: Tech Stack Tiles */}
      <section className="w-full max-w-6xl">
        <SectionHeader title="System Components" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {techStack.map((tech) => (
            <TechStackTile key={tech.name} {...tech} />
          ))}
        </div>
      </section>

      {/* Section 4: Execution Capabilities */}
      <section className="w-full max-w-5xl">
        <SectionHeader title="Execution Capabilities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.title} {...capability} />
          ))}
        </div>
      </section>

      {/* Section 5: System Live Telemetry (Optional) */}
      <section className="w-full max-w-5xl">
        <SectionHeader title="Live Telemetry" />
        <div className="mt-8">
          <LiveTelemetry />
        </div>
      </section>

      {/* Section 6: Design Philosophy */}
      <section className="w-full max-w-4xl text-left">
        <SectionHeader title="Design Philosophy" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
          {philosophies.map((philosophy) => (
            <PhilosophyCard key={philosophy.title} {...philosophy} />
          ))}
        </div>
      </section>

    </div>
  );
}
