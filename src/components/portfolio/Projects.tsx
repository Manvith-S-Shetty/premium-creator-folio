import { motion } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/config/data";
import { Section } from "./Section";

function has(v: string) {
  return typeof v === "string" && v.trim().length > 0 && v !== "#";
}

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Featured Work"
      title="Projects I've shipped"
      description="A selection of products and experiments — from real-time systems to AI-driven tools."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="group relative glass-card p-8 flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-foreground/25"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full accent-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />

            <h3 className="font-display text-3xl md:text-4xl tracking-tight text-gradient">
              {p.title}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{p.description}</p>

            <ul className="mt-6 space-y-2">
              {p.bullets.map((b, idx) => (
                <li
                  key={idx}
                  className="pl-4 relative text-sm text-foreground/80 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-foreground/40"
                >
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {p.techStack.map((t) => (
                <span
                  key={t}
                  className="text-[11px] uppercase tracking-wider rounded-full border border-border px-2.5 py-1 text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-6 text-sm">
              {has(p.githubUrl) && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <Github size={15} />
                  GitHub
                  <ArrowUpRight
                    size={14}
                    className="opacity-60 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </a>
              )}
              {has(p.liveUrl) && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground transition-colors"
                >
                  Live
                  <ArrowUpRight
                    size={14}
                    className="opacity-60 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
