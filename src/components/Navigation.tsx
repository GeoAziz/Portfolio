'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

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
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMac(window.navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  if (pathname === '/splash') {
    return null;
  }

  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-background">
      <div className="flex justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[1800px] flex h-14 items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 w-5 fill-foreground/90"
              >
                <path d="M128,32a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,32Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Z" />
              </svg>
              <span className="text-base font-normal text-foreground/90 tracking-normal hidden sm:inline">
                Personal OS
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center px-4 overflow-x-auto">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-normal transition-colors whitespace-nowrap',
                  pathname?.startsWith(link.href)
                    ? 'text-foreground/95'
                    : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end flex-1 md:flex-initial gap-2 lg:gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div
                onClick={openCommandPalette}
                className="flex items-center gap-2 px-3 h-9 rounded-md border border-foreground/10 bg-transparent hover:bg-foreground/[0.05] transition-colors cursor-pointer"
              >
                <span className="text-sm text-foreground/50">Search...</span>
                {mounted && (
                  <kbd className="font-mono text-[11px] text-foreground/50">
                    {isMac ? '⌘K' : 'Ctrl+K'}
                  </kbd>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
