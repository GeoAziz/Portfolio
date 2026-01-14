'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command, Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Inline ThemeToggle to avoid missing module error.
 * Provides a minimal light/dark toggle that updates `data-theme` on <html>.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      className="h-9 w-9"
    >
      {theme === 'light' ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5" strokeWidth="2" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="2" />
        </svg>
      )}
    </Button>
  );
}

/**
 * Minimal inline LanguageSwitcher to avoid missing module error.
 * Toggles document.documentElement.lang between 'en' and 'es'.
 */
export function LanguageSwitcher() {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return document.documentElement.lang || 'en';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLang(prev => (prev === 'en' ? 'es' : 'en'))}
      aria-label="Toggle language"
      data-testid="language-switcher"
      className="h-9 w-9"
    >
      <span className="sr-only">Toggle language</span>
      <span className="text-xs font-mono">{lang.toUpperCase()}</span>
    </Button>
  );
}

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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60" data-testid="navigation-header">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8 xl:px-10 2xl:px-12 mx-auto max-w-[1600px]">
        
        {/* Left Section: Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" data-testid="home-logo-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-5 w-5 fill-foreground"
            >
              <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
            </svg>
            <span className="hidden sm:inline-block text-sm font-normal font-headline text-foreground">
              Personal OS
            </span>
          </Link>
        </div>

        {/* Center Section: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2" data-testid="desktop-navigation">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={cn(
                'relative text-sm font-normal transition-all duration-200',
                pathname?.startsWith(link.href) 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground nav-link-hover'
              )}
            >
              {link.label}
              {pathname?.startsWith(link.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground/40 translate-y-1" />
              )}
            </Link>
          ))}
        </nav>
        
        {/* Right Section: Search + Utilities */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Desktop Search */}
          <button
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors group"
            aria-label="Open search"
            data-testid="search-button"
          >
            <Search className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Search</span>
            <kbd className="ml-auto hidden lg:inline-block text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Utilities: Theme, Language */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="mobile-menu-trigger">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]" data-testid="mobile-menu">
                <SheetHeader>
                  <SheetTitle className="sr-only">Main Menu</SheetTitle>
                </SheetHeader>
                <Link href="/" className="flex items-center gap-2 mb-8 mt-2" data-testid="mobile-home-logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="h-5 w-5 fill-foreground"
                  >
                    <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
                  </svg>
                  <span className="font-normal font-headline text-sm">Personal OS</span>
                </Link>
                <nav className="flex flex-col space-y-1" data-testid="mobile-navigation">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      className={cn(
                        'text-sm py-3 px-4 rounded-md transition-all duration-200',
                        pathname?.startsWith(link.href) 
                          ? 'text-foreground bg-muted' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex items-center gap-2 px-4">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
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