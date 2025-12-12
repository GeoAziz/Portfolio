
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Cpu, Container, Zap, Router, GitBranch, IterationCw, HeartPulse
} from 'lucide-react';

const icons: any = {
  Cpu,
  Container,
  Zap,
  Router,
  GitBranch,
  IterationCw,
  HeartPulse
};

interface CapabilityCardProps {
  title: string;
  description: string;
  icon: string;
}

export function CapabilityCard({ title, description, icon }: CapabilityCardProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 border-border/20 text-left h-full hover:bg-card/90 hover:border-accent/40 hover:shadow-lift-sm transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-4">
          {Icon && <Icon className="w-8 h-8 text-accent-light transition-colors duration-300 group-hover:text-accent" />}
          <CardTitle className="text-lg font-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
