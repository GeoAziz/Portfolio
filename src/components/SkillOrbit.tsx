
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cognitiveMap } from '@/lib/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';


export function SkillOrbit() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { centerNode, domains } = cognitiveMap.cognitiveMap;
  const orbitSpeed = hoveredDomain ? 180 : 120;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[320px] md:h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading cognitive map...</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <motion.div className="w-full max-w-2xl mx-auto space-y-8 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-2xl font-headline font-bold text-accent mb-2">{centerNode}</h3>
          <p className="text-sm text-muted-foreground">Scroll through the cognitive architecture</p>
        </motion.div>
        <div className="space-y-6">
          {domains.map((domain, index) => (
            <motion.div key={domain.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer" onClick={() => router.push(domain.linkedPage)} whileTap={{ scale: 0.98 }}>
              <motion.h4 className="text-xl font-headline font-semibold mb-4 flex items-center gap-3" style={{ color: domain.color }}>
                <motion.span className="w-3 h-3 rounded-full" style={{ backgroundColor: domain.color }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                {domain.name}
              </motion.h4>
              <ul className="space-y-2">
                {domain.subskills.map((skill, idx) => (
                  <motion.li key={idx} className="text-sm text-muted-foreground flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + idx * 0.05 }}>
                    <span className="text-accent mt-1">•</span>
                    <span>{skill}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Desktop: Orbital visualization
  const radius = 220;
  const centerSize = 140;

  return (
    <motion.div className="relative w-full flex items-center justify-center h-[600px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      {/* Central Node */}
      <motion.div className="absolute z-20 flex items-center justify-center" style={{ width: centerSize, height: centerSize }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
        <motion.div className="absolute inset-0 rounded-full border-2 border-accent/30" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative z-10 bg-card border-2 border-accent rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-accent/20">
          <div className="text-center px-4">
            <h3 className="text-lg font-headline font-bold text-foreground leading-tight">{centerNode}</h3>
          </div>
        </div>
        <motion.div className="absolute w-2 h-2 rounded-full bg-accent" animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>

      {/* Orbit path */}
      <motion.div className="absolute rounded-full border border-dashed border-border/30" style={{ width: radius * 2, height: radius * 2 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} />

      {/* Rotating container */}
      <motion.div className="absolute w-full h-full" animate={{ rotate: 360 }} transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}>
        {domains.map((domain, index) => {
          const angle = (index / domains.length) * 2 * Math.PI - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isHovered = hoveredDomain === domain.name;

          return (
            <motion.div key={domain.name} className="absolute cursor-pointer group" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }} onHoverStart={() => setHoveredDomain(domain.name)} onHoverEnd={() => setHoveredDomain(null)} onClick={() => router.push(domain.linkedPage)}>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}>
                <motion.div className="relative" whileHover={{ scale: 1.3 }} transition={{ duration: 0.3 }}>
                  <motion.div className="absolute inset-0 rounded-full blur-md -z-10" style={{ backgroundColor: domain.color }} animate={{ opacity: isHovered ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2], scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div className="relative w-5 h-5 rounded-full border-2" style={{ backgroundColor: domain.color, borderColor: domain.color, boxShadow: isHovered ? `0 0 20px ${domain.color}` : `0 0 10px ${domain.color}80` }} animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }} transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }} />
                </motion.div>
                <motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + index * 0.1 }}>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-card/90 backdrop-blur-sm border border-border" style={{ color: domain.color }}>{domain.name}</span>
                </motion.div>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-64 z-30" initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }} transition={{ duration: 0.3 }}>
                      <div className="bg-card/95 backdrop-blur-md border-2 rounded-lg p-4 shadow-xl" style={{ borderColor: domain.color }}>
                        <h4 className="text-sm font-headline font-semibold mb-3" style={{ color: domain.color }}>{domain.name}</h4>
                        <ul className="space-y-2">
                          {domain.subskills.map((skill, idx) => (
                            <motion.li key={idx} className="text-xs text-muted-foreground flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                              <span style={{ color: domain.color }}>•</span>
                              <span>{skill}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div className="mt-3 pt-3 border-t border-border text-xs text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                          <span className="text-muted-foreground">Click to explore →</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hover instruction */}
      <AnimatePresence>
        {!hoveredDomain && (
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 2 }}>
            <p className="text-xs text-muted-foreground/60">Hover over nodes to explore cognitive domains</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
