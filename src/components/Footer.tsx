
'use client';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/splash') {
    return null;
  }

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col items-center text-center">
        <p className="text-md font-headline text-foreground">
          Engineer Dev Mahn X — Future-centric systems builder.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Made with curiosity & computation.
        </p>
      </div>
    </footer>
  );
}
