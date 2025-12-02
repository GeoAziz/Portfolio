
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import cognitiveData from '@/data/cognitive-map.json';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const { cognitiveMap } = cognitiveData;

export function SkillOrbit() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { centerNode, domains } = cognitiveMap;
  const orbitSpeed = hoveredDomain ? 240 : 150; // Slower, more like breathing

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, 600], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 600], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set(event.clientX - left - width / 2);
      mouseY.set(event.clientY - top - height / 2);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove as any);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove as any);
      }
    };
  }, [handleMouseMove]);

  if (!isMounted) {
    return (
      <div className="w-full h-[320px] md:h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading cognitive map...</p>
      </div>
    );
  }

  // Mobile: Collapsible Accordion
  if (isMobile) {
    return (
      <motion.div
        className="w-full max-w-2xl mx-auto space-y-8 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-headline font-bold text-accent mb-2">{centerNode}</h3>
          <p className="text-sm text-muted-foreground">A conceptual map of my engineering mind.</p>
        </motion.div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={domain.name} className="bg-card border border-border rounded-lg hover:border-accent/50 transition-colors duration-300">
                <AccordionTrigger className="p-4 md:p-6 text-lg font-headline w-full text-left">
                  {domain.name}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <ul className="space-y-2 mt-2">
                    {domain.subskills.map((skill, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    );
  }

  // Desktop: Orbital visualization
  const radius = 250;
  const centerSize = 140;
  const nodeSize = 8;

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full flex items-center justify-center h-[600px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ rotateX, rotateY }}>
        {/* Central Node */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="absolute z-20 flex items-center justify-center"
                style={{ width: centerSize, height: centerSize, top: '50%', left: '50%', x: '-50%', y: '-50%' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Outer breathing glow ring */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30" 
                  animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                />
                {/* Inner glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-cyan-400/5 blur-xl" 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                />
                <div className="relative z-10 bg-card border-2 border-cyan-400/80 rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <div className="text-center px-4">
                    <h3 className="text-lg font-headline font-bold text-foreground leading-tight">{centerNode}</h3>
                  </div>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Core modes of thinking and reasoning</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Orbit path */}
        <motion.div className="absolute rounded-full border border-dashed border-border/20" style={{ width: radius * 2, height: radius * 2, top: '50%', left: '50%', x: '-50%', y: '-50%' }} />

        {/* Connecting lines from center to hovered node */}
        <AnimatePresence>
          {hoveredDomain && domains.map((domain, index) => {
            if (domain.name !== hoveredDomain) return null;
            const angle = (index / domains.length) * 2 * Math.PI - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const lineLength = Math.sqrt(x * x + y * y);
            const lineAngle = Math.atan2(y, x) * (180 / Math.PI);

            return (
              <motion.div
                key={`line-${domain.name}`}
                className="absolute"
                style={{
                  width: lineLength - 70,
                  height: 1,
                  background: 'linear-gradient(to right, hsl(196, 100%, 70%, 0.3), hsl(196, 100%, 70%, 0))',
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${lineAngle}deg)`,
                  marginLeft: '70px',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </AnimatePresence>

        {/* Rotating container */}
        <motion.div className="absolute w-full h-full" style={{ top: '50%', left: '50%' }} animate={{ rotate: 360 }} transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}>
          {domains.map((domain, index) => {
            const angle = (index / domains.length) * 2 * Math.PI - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const isHovered = hoveredDomain === domain.name;

            return (
              <motion.div
                key={domain.name}
                className="absolute cursor-pointer group"
                style={{ transform: `translate(${x}px, ${y}px)` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                onHoverStart={() => setHoveredDomain(domain.name)}
                onHoverEnd={() => setHoveredDomain(null)}
                onClick={() => router.push(domain.linkedPage!)}
                tabIndex={0}
              >
                <motion.div animate={{ rotate: -360 }} transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="relative flex items-center justify-center" whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    {/* Outer glow ring */}
                    <motion.div 
                      className="absolute rounded-full blur-lg -z-10 bg-cyan-400" 
                      style={{ width: nodeSize * 3, height: nodeSize * 3 }} 
                      animate={{ 
                        opacity: isHovered ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2], 
                        scale: isHovered ? [1, 1.3, 1] : [1, 1.15, 1] 
                      }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                    />
                    {/* Inner glow */}
                    <motion.div 
                      className="absolute rounded-full blur-md -z-10 bg-cyan-300" 
                      style={{ width: nodeSize * 1.5, height: nodeSize * 1.5 }} 
                      animate={{ 
                        opacity: isHovered ? [0.7, 1, 0.7] : [0.4, 0.6, 0.4], 
                      }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
                    />
                    {/* Core node */}
                    <motion.div 
                      className="relative rounded-full border bg-cyan-500 border-cyan-400" 
                      style={{ 
                        width: nodeSize, 
                        height: nodeSize, 
                        boxShadow: isHovered 
                          ? `0 0 16px hsla(196, 100%, 70%, 0.8), 0 0 8px hsla(196, 100%, 70%, 0.6)` 
                          : `0 0 10px hsla(196, 100%, 70%, 0.5), 0 0 4px hsla(196, 100%, 70%, 0.3)` 
                      }} 
                    />
                  </motion.div>
                  {/* Label - hidden on hover to prevent overlap */}
                  <motion.div 
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none" 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: isHovered ? 0 : 1, y: 0 }} 
                    transition={{ delay: isHovered ? 0 : 1 + index * 0.1, duration: 0.2 }}
                  >
                    <span className="text-xs font-light text-muted-foreground px-2 py-1 rounded-md bg-card/60 backdrop-blur-sm border border-transparent">{domain.name}</span>
                  </motion.div>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div className="absolute top-full mt-10 left-1/2 -translate-x-1/2 w-56 z-30 pointer-events-none" initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }} transition={{ duration: 0.3 }}>
                        <div className="bg-card/95 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4 shadow-2xl shadow-cyan-500/10">
                          <ul className="space-y-2">
                            {domain.subskills.map((skill, idx) => (
                              <motion.li key={idx} className="text-xs text-muted-foreground flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                                <span className="text-cyan-400">•</span>
                                <span>{skill}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Subtle hint text */}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredDomain ? 0 : 0.5 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <p className="text-xs text-muted-foreground/60 font-light">Hover nodes to explore • Click to navigate</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
