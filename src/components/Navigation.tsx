
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect if screen is mobile on mount and on resize
  // `mounted` ensures server and initial client render are identical (preventing hydration mismatch)
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Close sheet when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't show navigation on the splash page
  if (pathname === '/splash') {
    return null;
  }

  const openCommandPalette = () => {
    // Simulate Ctrl+K or Cmd+K
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true });
    document.dispatchEvent(event);
  };

  // Only render the drawer on mobile screens
  const handleOpenChange = (open: boolean) => {
    if (window.innerWidth < 768) {
      setIsOpen(open);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full max-w-[1800px] flex h-14 items-center justify-between">
          {/* Left Section: Brand */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 w-5 fill-foreground/90"
              >
                <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
              </svg>
              <span className="text-sm font-normal text-foreground/90 tracking-normal">
                Personal OS
              </span>
            </Link>
          </div>

          {/* Center Section: Primary Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 flex-1 justify-center px-12">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-normal transition-colors',
                  pathname?.startsWith(link.href) 
                    ? 'text-foreground/95 border-b border-foreground/40' 
                    : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Logo */}
          {mounted && isMobile && (
            <Link href="/" className="flex items-center gap-2 flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 w-5 fill-foreground"
              >
                <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
              </svg>
              <span className="text-sm font-normal text-foreground">Personal OS</span>
            </Link>
          )}

          {/* Right Section: Utilities */}
          <div className="flex items-center gap-5 lg:gap-6 shrink-0">
            <div className="hidden md:flex items-center gap-5">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <button
              onClick={openCommandPalette}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors"
            >
              <span className="text-xs text-foreground/60">Search</span>
              <kbd className="font-mono text-[11px] text-foreground/50">⌘K</kbd>
            </button>

            {/* Mobile Menu Button */}
            {mounted && isMobile && (
              <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-foreground/5">
                    <Menu className="h-4 w-4 text-foreground/70" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                  </SheetHeader>
                  <Link href="/" className="flex items-center gap-2 mb-8 mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className="h-6 w-6 fill-foreground"
                    >
                      <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
                    </svg>
                    <span className="font-normal text-sm">Personal OS</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'text-sm py-2.5 px-3 rounded transition-colors',
                          pathname?.startsWith(link.href) 
                            ? 'text-foreground bg-foreground/5' 
                            : 'text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            
            {mounted && !isMobile && (
              <div className="md:hidden flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
