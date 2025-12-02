'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("relative text-center mb-12", className)}>
      <motion.h2
        className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-20 bg-accent rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
