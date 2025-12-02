
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';

const metrics = [
  { name: 'CPU Activity', icon: Cpu },
  { name: 'Memory Usage', icon: MemoryStick },
  { name: 'Storage IO', icon: HardDrive },
  { name: 'Network Throughput', icon: Network },
];

const LoadingBar = ({ value }: { value: number }) => (
  <div className="w-full bg-secondary rounded-full h-2.5">
    <motion.div
      className="bg-accent h-2.5 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    />
  </div>
);

export function LiveTelemetry() {
  const [values, setValues] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(metrics.map(() => Math.random() * 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 border rounded-lg bg-card/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={metric.name} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <metric.icon className="w-5 h-5 text-muted-foreground" />
              <p className="font-mono text-sm text-foreground">{metric.name}</p>
            </div>
            <LoadingBar value={values[index]} />
            <p className="text-xs text-muted-foreground mt-1.5">{Math.round(values[index])}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
