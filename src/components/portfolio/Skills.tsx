import { motion } from "motion/react";
import { skills } from "@/config/data";
import { Section } from "./Section";

export function Skills() {
  const entries = Object.entries(skills);
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tools I build with"
      description="A pragmatic stack I reach for — the tools that ship products, not the ones on my resume for the sake of it."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map(([category, items], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group glass-card p-6 transition-all hover:border-foreground/20 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-foreground/90">{category}</div>
              <div className="h-1.5 w-1.5 rounded-full accent-gradient" />
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <span
                  key={s}
                  className="text-xs rounded-md border border-border bg-white/[0.03] px-2.5 py-1 text-foreground/75 transition-colors group-hover:border-foreground/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
