
'use client';

import { useState, useMemo, useEffect } from 'react';
import { skillsData } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

type Skill = typeof skillsData[0];

const orbitConfig = {
  frontend: { radius: 100, duration: 60 },
  backend: { radius: 180, duration: 90 },
};

const mobileOrbitConfig = {
  frontend: { radius: 60, duration: 60 },
  backend: { radius: 120, duration: 90 },
};

// Simple categorization for demo
function getCategory(skillName: string): keyof typeof orbitConfig {
    const backendSkills = ['Python', 'Distributed Systems', 'Machine Learning', 'Docker', 'Git', 'Arduino'];
    if (backendSkills.includes(skillName)) return 'backend';
    return 'frontend';
}


export function SkillOrbit() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const orbits = useMemo(() => {
    const config = isMobile ? mobileOrbitConfig : orbitConfig;
    const categories: (keyof typeof config)[] = ['frontend', 'backend'];
    
    return categories.map((category, i) => ({
      category,
      radius: config[category].radius,
      skills: skillsData.filter(s => getCategory(s.name) === category),
      duration: config[category].duration,
    }));
  }, [isMobile]);

  if (!isMounted) {
    return (
      <div className="w-full h-[320px] md:h-[480px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading cognitive map...</p>
      </div>
    );
  }

  if (isMobile) {
      return (
          <Card className="w-full max-w-md mx-auto bg-card border-border">
              <CardHeader>
                  <CardTitle className="text-center font-headline text-2xl">Cognitive Skill Map</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-wrap justify-center gap-2">
                      {skillsData.map((skill) => (
                          <Badge key={skill.name} variant="secondary" className="text-sm py-1 px-3 font-mono">{skill.name}</Badge>
                      ))}
                  </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="relative w-full flex items-center justify-center h-[320px] md:h-[480px]">
      {/* Central Point */}
      <div className="absolute w-3 h-3 rounded-full bg-accent/50"></div>
      <div className="absolute w-1.5 h-1.5 rounded-full bg-accent"></div>

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
              animation: `spin-slow ${orbit.duration}s linear infinite`,
            }}
          >
            {orbit.skills.map((skill: Skill, skillIndex: number) => {
              if (orbit.skills.length === 0) return null;
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
                      'w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer',
                      skill.level === 'Advanced' ? 'bg-accent' : 'bg-accent-2'
                    )}
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
      ))}\
    </div>
  );
}
