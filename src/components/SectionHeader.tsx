
import { cn } from '@/lib/utils';

export function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("relative text-center mb-12", className)}>
      <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-20 bg-accent rounded-full" />
    </div>
  );
}
