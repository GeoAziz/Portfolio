
'use client';

import { motion } from 'framer-motion';

interface PhilosophyCardProps {
  title: string;
  description: string;
}

export function PhilosophyCard({ title, description }: PhilosophyCardProps) {
  return (
    <motion.div
      className="border-l-4 border-accent pl-6 py-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-headline text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}
