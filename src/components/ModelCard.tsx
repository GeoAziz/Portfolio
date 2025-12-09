
'use client';

import { motion } from 'framer-motion';

export interface ModelCardProps { // Updated export
  name: string;
  type: string;
  scope: string;
  specs: string;
  status: 'ACTIVE' | 'CLOUD LINKED' | 'EXPERIMENTAL';
}

export function ModelCard({ name, type, scope, specs, status }: ModelCardProps) {
  const statusColors = {
    ACTIVE: 'text-green-400',
    'CLOUD LINKED': 'text-cyan-400',
    EXPERIMENTAL: 'text-amber-400',
  };

  return (
    <motion.div
      className="bg-card/60 backdrop-blur-sm border border-border/20 rounded-lg p-6 h-full flex flex-col justify-between"
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h3 className="text-xl font-headline text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-2">{type}</p>
        <p className="text-sm text-muted-foreground">{scope}</p>
        <p className="text-xs text-muted-foreground mt-4 font-mono">{specs}</p>
      </div>
      <div className="mt-6 text-right">
        <span className={`text-xs font-bold ${statusColors[status]}`}>{status}</span>
      </div>
    </motion.div>
  );
}
