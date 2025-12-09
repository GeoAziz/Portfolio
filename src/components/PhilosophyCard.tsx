
'use client';

import { motion } from 'framer-motion';

interface PhilosophyCardProps {
  title: string;
  text: string;
}

export function PhilosophyCard({ title, text }: PhilosophyCardProps) {
  return (
    <motion.div
      className="bg-card/40 backdrop-blur-sm border border-border/10 rounded-lg p-6 text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-lg font-headline text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{text}</p>
    </motion.div>
  );
}
