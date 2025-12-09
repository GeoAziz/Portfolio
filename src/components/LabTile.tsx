
'use client';

import { motion } from 'framer-motion';

interface LabTileProps {
  title: string;
  description: string;
}

export function LabTile({ title, description }: LabTileProps) {
  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6 h-full flex flex-col justify-center items-center text-center"
      whileHover={{ y: -8, scale: 1.05, borderColor: 'rgba(0, 255, 255, 0.5)' }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-headline text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </motion.div>
  );
}
