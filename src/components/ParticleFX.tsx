
'use client';

import { useEffect, useRef } from 'react';

export function ParticleFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles(); // Re-create particles on resize
    };
    
    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];
    
    // Adjust particle count based on screen size for performance
    const getParticleCount = () => {
        if (typeof window === 'undefined') return 100;
        const screenArea = window.innerWidth * window.innerHeight;
        // Use a lower density for smaller screens
        const density = window.innerWidth < 768 ? 40000 : 20000;
        return Math.floor(screenArea / density);
    }


    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2; // Slower speed
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 1.2 + 0.5; // Smaller particles
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'hsla(196, 100%, 70%, 0.15)'; // Even more subtle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createParticles() {
        particles = [];
        const particleCount = getParticleCount();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    }

  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10" />;
}
