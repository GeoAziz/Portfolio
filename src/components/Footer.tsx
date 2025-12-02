
'use client';
import { usePathname } from 'next/navigation';
import { Github, Linkedin, Mail } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { Button } from './ui/button';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/splash') {
    return null;
  }

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col items-center text-center space-y-4">
        <p className="text-md font-headline text-foreground">
          Engineer Dev Mahn X — Future-centric systems builder.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/GeoAziz" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <CopyButton 
            text="dev@devmahnx.com" 
            label="Email"
            variant="ghost"
            size="sm"
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Made with curiosity & computation.
        </p>
      </div>
    </footer>
  );
}
