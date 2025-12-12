
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { cn } from '@/lib/utils';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { ScrollProgress } from '@/components/ScrollProgress';
import { KeyboardHints } from '@/components/KeyboardHints';
import { Toaster } from '@/components/ui/toaster';
import { CommandPaletteWrapper } from '@/components/CommandPaletteWrapper';
import { ParticleFX } from '@/components/ParticleFX';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'A personal portfolio designed as an operating system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden')}>
        <ScrollProgress />
        <ParticleFX />
        <div className="relative z-10 flex flex-col flex-grow">
          <Navigation />
          <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-16">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </div>
        <BackToTop />
        <KeyboardHints />
        <CommandPaletteWrapper />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
