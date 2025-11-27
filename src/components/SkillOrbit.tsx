
'use client';

import { useState, useMemo, useEffect } from 'react';
import { skillsData } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type Skill = typeof skillsData[0];

const categories = ['frontend', 'backend', 'tools'];

export function SkillOrbit() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const orbits = useMemo(() => {
    const orbitSizes = isMobile ? [80, 140, 200] : [120, 220, 320];
    return categories.map((category, i) => ({
      category,
      radius: orbitSizes[i],
      skills: skillsData.filter(s => s.category === category),
      duration: 60 + i * 30, // seconds for a full rotation
    }));
  }, [isMobile]);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] md:h-[640px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading skill orbit...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center h-[400px] md:h-[640px]">
      {/* Central Point */}
      <div className="absolute w-4 h-4 rounded-full bg-accent/50"></div>
      <div className="absolute w-2 h-2 rounded-full bg-accent"></div>

      {orbits.map((orbit, orbitIndex) => (
        <div key={orbit.category}>
          {/* The orbit path */}
          <div
            className="absolute rounded-full border border-dashed border-border/50"
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              top: `calc(50% - ${orbit.radius}px)`,
              left: `calc(50% - ${orbit.radius}px)`,
            }}
          />
          {/* The rotating container for skills */}
          <div
            className="absolute w-full h-full"
            style={{
              animation: `spin-slow ${orbit.duration}s linear infinite ${orbitIndex % 2 === 0 ? '' : 'reverse'}`,
            }}
          >
            {orbit.skills.map((skill: Skill, skillIndex: number) => {
              const angle = (skillIndex / orbit.skills.length) * 2 * Math.PI;
              const x = orbit.radius * Math.cos(angle);
              const y = orbit.radius * Math.sin(angle);

              return (
                <div
                  key={skill.name}
                  className="absolute group"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
                >
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full transition-all duration-300 cursor-pointer',
                      'group-hover:scale-150',
                      skill.level === 'expert' ? 'bg-accent' : 'bg-accent-2-DEFAULT'
                    )}
                    style={{
                      animation: `spin-slow ${orbit.duration}s linear infinite ${orbitIndex % 2 === 0 ? 'reverse' : ''}`,
                    }}
                  ></div>
                  <span
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-card text-foreground text-xs rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                  >
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
