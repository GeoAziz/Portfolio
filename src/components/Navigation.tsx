'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command, Menu, Search, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: '/ai', label: 'AI' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/research', label: 'Research' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/blog', label: 'Blog' },
  { href: '/resume', label: 'Resume' },
];

export function Navigation() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (pathname === '/splash') {
    return null;
  }

  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true });
    document.dispatchEvent(event);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
      data-testid="navigation-header"
    >
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center px-4 sm:px-6 md:px-8">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center space-x-2 shrink-0" data-testid="home-logo-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-6 w-6 fill-foreground"
          >
            <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,208Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
          </svg>
          <span className="font-bold hidden sm:inline">Personal OS</span>
        </Link>

        {/* Desktop Navigation - Center (hidden below 768px) */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium" data-testid="desktop-navigation">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith(link.href) 
                  ? 'text-foreground' 
                  : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side utilities */}
        <div className="flex items-center space-x-2 shrink-0 ml-auto md:ml-0">
          {/* Search - desktop only (hidden below 768px) */}
          <button
            onClick={openCommandPalette}
            className="hidden md:inline-flex items-center rounded-md font-medium transition-colors border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-sm text-muted-foreground"
            data-testid="search-button"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-2 hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>

          {/* Theme toggle - always visible */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-testid="theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Mobile Menu - ONLY visible below 768px, hidden on md+ */}
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  data-testid="mobile-menu-trigger"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]" data-testid="mobile-menu">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className="h-6 w-6 fill-foreground"
                    >
                      <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,208Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
                    </svg>
                    <span className="font-bold">Personal OS</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 mt-8" data-testid="mobile-navigation">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                    className={cn(
                      'text-lg py-2 transition-colors',
                      pathname?.startsWith(link.href) 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-8 left-6 right-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={openCommandPalette}
                  data-testid="mobile-search-button"
                >
                  <Command className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  );
}

export function ThemeToggle() {
  return null;
}

export function LanguageSwitcher() {
  return null;
}