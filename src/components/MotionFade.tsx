
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function MotionFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("animate-fade-in-up opacity-0", className)} style={{ animationFillMode: 'forwards' }}>
      {children}
    </div>
  );
}
