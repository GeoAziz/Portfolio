
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const layers = [
  {
    id: 'ui',
    name: 'UI Layer',
    description: 'Handles user interaction, rendering, and state management for the front-end experience. Built with modern, reactive frameworks.',
    tech: 'Next.js, React, Tailwind CSS, Framer Motion',
  },
  {
    id: 'app',
    name: 'Application Logic & APIs',
    description: 'Manages core business logic, serves data, and exposes endpoints for the UI layer to consume. The central nervous system.',
    tech: 'Node.js, Express, REST/GraphQL APIs',
  },
  {
    id: 'ai',
    name: 'AI / Reasoning Layer',
    description: 'Handles inference, model execution, embeddings, contextual indexing, and memory flows for intelligent features.',
    tech: 'Python, PyTorch, LangChain, Vector DBs',
  },
  {
    id: 'data',
    name: 'Data Layer & Storage',
    description: 'Provides robust and scalable data persistence, caching, and retrieval for all parts of the system.',
    tech: 'PostgreSQL, Redis, MongoDB',
  },
  {
    id: 'hardware',
    name: 'Hardware & Device Interface',
    description: 'Interfaces with physical devices, sensors, and microcontrollers for real-world interaction and data collection.',
    tech: 'C/C++, Rust, MQTT, GPIO/I2C',
  },
];

const Layer = ({ layer, onHover, onClick, isSelected, isHovered }: any) => {
  return (
    <motion.div
      layout
      onHoverStart={() => onHover(layer.id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onClick(layer.id)}
      className="relative mb-2"
    >
      <motion.div
        animate={{
          scale: isSelected ? 1.05 : 1,
          backgroundColor: isHovered ? 'hsl(var(--secondary))' : 'hsl(var(--card))',
        }}
        transition={{ duration: 0.2 }}
        className="w-full text-center p-4 rounded-lg border border-border cursor-pointer"
      >
        <h3 className="font-mono text-lg text-foreground">{layer.name}</h3>
      </motion.div>
      {isHovered && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-accent -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export function ArchitectureDiagram() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedLayer = layers.find(l => l.id === selectedId);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Left side: The stack */}
      <div className="w-full md:w-1/2">
        {layers.map(layer => (
          <Layer
            key={layer.id}
            layer={layer}
            onHover={setHoveredId}
            onClick={setSelectedId}
            isSelected={selectedId === layer.id}
            isHovered={hoveredId === layer.id}
          />
        ))}
      </div>

      {/* Right side: The explanation card */}
      <div className="w-full md:w-1/2 min-h-[300px] md:min-h-0">
        <AnimatePresence>
          {selectedLayer ? (
            <motion.div
              key={selectedLayer.id}
              className="p-6 border rounded-lg bg-card/80 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-headline text-accent mb-3">{selectedLayer.name}</h3>
              <p className="text-muted-foreground mb-4">{selectedLayer.description}</p>
              <p className="font-mono text-sm text-foreground/80">{selectedLayer.tech}</p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground p-6 border border-dashed rounded-lg sticky top-24">
              <p>Click on a layer to see details</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
