
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function MotionFade({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn("animate-fade-in-up opacity-0", className)} 
      style={{ 
        animationFillMode: 'forwards',
        animationDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}
