
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TechStackTileProps {
  name: string;
  usage: string;
  competency: 'Mastered' | 'Proficient' | 'Learning';
}

export function TechStackTile({ name, usage, competency }: TechStackTileProps) {
  const competencyColors = {
    Mastered: 'text-green-400',
    Proficient: 'text-cyan-400',
    Learning: 'text-amber-400',
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-card/60 backdrop-blur-sm border-border/20 h-full hover:border-accent/50 transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-headline">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{usage}</p>
          <p className={`text-xs font-bold ${competencyColors[competency]}`}>{competency}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
