
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
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
  { href: '/resume', label: 'Resume' },
];

export function Navigation() {
  const pathname = usePathname();

  // Don't show navigation on the splash page
  if (pathname === '/splash') {
    return null;
  }

  const openCommandPalette = () => {
    // Simulate Ctrl+K or Cmd+K
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-6 w-6 fill-foreground"
            >
              <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
            </svg>
            <span className="hidden font-bold sm:inline-block font-headline">
              Personal OS
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative transition-colors hover:text-accent nav-link',
                  pathname === link.href ? 'text-foreground active' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <SheetHeader>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
              </SheetHeader>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="h-6 w-6 fill-foreground"
                  >
                    <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
                  </svg>
                <span className="font-bold font-headline">Personal OS</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-lg',
                      pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
           <Button variant="outline" size="sm" onClick={openCommandPalette} className="flex items-center gap-2">
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>
    </header>
  );
}
