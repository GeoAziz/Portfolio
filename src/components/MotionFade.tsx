
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
      // Do not force `opacity-0` here — rely on the animation keyframes to handle
      // the fade-in. Keeping an explicit opacity:0 class can leave content hidden
      // if client animations/hydration fail, which makes the page appear blank.
      className={cn("animate-fade-in-up", className)}
      style={{
        animationFillMode: 'forwards',
        animationDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}
