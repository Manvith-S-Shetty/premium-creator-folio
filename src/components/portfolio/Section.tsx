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
  bg?: "primary" | "secondary";
};

export function Section({ id, eyebrow, title, description, children, className, bg = "primary" }: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-24 transition-colors duration-200",
        bg === "secondary" ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-primary)]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12 max-w-2xl"
        >
          {eyebrow && (
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-block h-[2px] w-10 shrink-0 bg-gradient-to-r from-[var(--accent-chrome-1)] to-[var(--accent-chrome-2)]"
                aria-hidden="true"
              />
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] font-medium">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="relative font-display text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}



