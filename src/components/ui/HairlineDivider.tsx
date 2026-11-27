import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HairlineDividerProps {
  className?: string;
  animate?: boolean;
}

export function HairlineDivider({ className, animate = true }: HairlineDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    if (!animate || swept) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSwept(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, swept]);

  return (
    <div
      ref={ref}
      className={cn(
        "chrome-divider opacity-70 my-0",
        swept && "animate-chrome-sweep",
        className
      )}
      aria-hidden="true"
    />
  );
}
