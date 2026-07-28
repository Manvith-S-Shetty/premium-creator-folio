import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, children, className }: Props) {
  return (
    <section id={id} className={cn("relative py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 max-w-2xl"
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
              {eyebrow}
            </div>
          )}
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-gradient">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
