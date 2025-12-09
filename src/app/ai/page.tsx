
'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import { ModelCard, ModelCardProps } from '@/components/ModelCard'; // Updated import
import { LabTile } from '@/components/LabTile';
import { PhilosophyCard } from '@/components/PhilosophyCard';
import { InteractiveModelDemo } from '@/components/InteractiveModelDemo';
import { ModelGraph } from '@/components/ModelGraph';
import { ExampleOutput } from '@/components/ExampleOutput';
import aiModelsData from '@/data/ai-models.json';
import aiExperimentsData from '@/data/ai-experiments.json';
import aiPhilosophyData from '@/data/ai-philosophy.json';
import aiExampleOutputsData from '@/data/ai-example-outputs.json';

const { models } = aiModelsData;
const { experiments } = aiExperimentsData;
const { philosophy } = aiPhilosophyData;
const { outputs } = aiExampleOutputsData;

export default function AiPage() {
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
          AI Systems & Cognitive Engines
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          This is my playground for experimenting with machine learning models, autonomous reasoning tools, and intelligent pipelines.
        </p>
      </motion.section>

      {/* Section 2: Model Playground */}
      <section className="w-full max-w-7xl">
        <SectionHeader title="Model Playground" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {models.map((model) => (
            <ModelCard key={model.name} {...model as unknown as ModelCardProps} />
          ))}
        </div>
      </section>

      {/* Section 3: AI Experiments & Research Sandbox */}
      <section className="w-full max-w-7xl">
        <SectionHeader title="AI Experiments & Research Sandbox" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {experiments.map((experiment) => (
            <LabTile key={experiment.title} {...experiment} />
          ))}
        </div>
      </section>

      {/* Section 4: AI Philosophy & Approach */}
      <section className="w-full max-w-4xl text-left">
        <SectionHeader title="AI Philosophy & Approach" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
          {philosophy.map((item) => (
            <PhilosophyCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* Section 5: Interactive Model Demo */}
      <section className="w-full max-w-4xl">
        <SectionHeader title="Interactive Model Demo" />
        <div className="mt-8">
          <InteractiveModelDemo />
        </div>
      </section>

      {/* Section 6: Model Graph Visualization */}
      <section className="w-full max-w-5xl">
        <SectionHeader title="Model Graph Visualization" />
        <div className="mt-8">
          <ModelGraph />
        </div>
      </section>

      {/* Section 7: Example Outputs */}
      <section className="w-full max-w-4xl text-left">
        <SectionHeader title="Example Outputs" />
        <div className="grid grid-cols-1 gap-6 mt-8">
          {outputs.map((output) => (
            <ExampleOutput key={output.prompt} {...output} />
          ))}
        </div>
      </section>

    </div>
  );
}
