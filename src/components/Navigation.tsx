
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Command, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: '/systems', label: 'Systems' },
  { href: '/ai', label: 'AI' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/research', label: 'Research' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/blog', label: 'Blog' },
  { href: '/resume', label: 'Resume' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === '/splash') {
    return null;
  }

  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[1800px] flex h-14 items-center justify-between">
          
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 w-5 fill-foreground/90"
              >
                <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
              </svg>
              <span className="text-sm font-normal text-foreground/90 tracking-normal hidden sm:inline">
                Personal OS
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-4 lg:gap-6 flex-1 justify-center px-4 overflow-x-auto">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-normal transition-colors nav-link whitespace-nowrap',
                  pathname?.startsWith(link.href) 
                    ? 'text-foreground/95 active' 
                    : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end flex-1 md:flex-initial gap-2 lg:gap-4 shrink-0">
            <div className="flex items-center gap-2 lg:gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              
              <div className="hidden md:flex">
                <button
                  onClick={openCommandPalette}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors"
                >
                  <span className="text-xs text-foreground/60">Search</span>
                  <kbd className="font-mono text-[11px] text-foreground/50">⌘K</kbd>
                </button>
              </div>
            </div>
            
            <div className="flex md:hidden">
              <button
                  onClick={openCommandPalette}
                  className="flex items-center justify-center h-9 w-9 hover:bg-foreground/5 rounded-md"
                  aria-label="Open search"
                >
                <Command className="h-4 w-4 text-foreground/70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
