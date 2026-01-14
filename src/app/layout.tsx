
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
import { PWAInitializer } from '@/components/PWAInitializer';

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'A personal portfolio designed as an operating system.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Personal OS',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
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
        <PWAInitializer />
        <ScrollProgress />
        <ParticleFX />
        <Navigation />
        <main className="flex-grow w-full flex justify-center px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-16" data-testid="main-content">
          <div className="w-full max-w-[1600px]">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
        <Footer />
        <BackToTop />
        <KeyboardHints />
        <CommandPaletteWrapper />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
