import { useRef } from "react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { skills as staticSkills } from "@/config/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Skills({ bg = "primary" }: { bg?: "primary" | "secondary" }) {
  const { skills: dbSkills } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const groupedSkills: Record<string, string[]> =
    Array.isArray(dbSkills) && dbSkills.length > 0
      ? dbSkills.reduce(
          (acc, skill) => {
            if (!skill.category || !skill.name) return acc;
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill.name);
            return acc;
          },
          {} as Record<string, string[]>,
        )
      : staticSkills;

  const entries = Object.entries(groupedSkills).filter(([, items]) => items.length > 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".skills-header", {
          y: 20,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from(".skill-row", {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".skills-matrix",
            start: "top 82%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".skills-header", ".skill-row"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef, dependencies: [entries.length] },
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="skills-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 md:mb-16">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Technical Capabilities
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-lg">
              Core languages, frameworks, and infrastructure tools used across full-stack systems
              and machine learning workflows.
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
            Technical capabilities are currently being updated.
          </div>
        ) : (
          <div className="skills-matrix border-t border-[var(--hairline-rule)]">
            {entries.map(([category, items]) => (
              <div
                key={category}
                className="skill-row grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-6 md:py-7 border-b border-[var(--hairline-rule)] items-baseline"
              >
                <div className="md:col-span-4">
                  <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[var(--stone-400)]">
                    {category}
                  </h3>
                </div>
                <div className="md:col-span-8 flex flex-wrap items-center gap-x-6 gap-y-2.5">
                  {items.map((skillName) => (
                    <span
                      key={skillName}
                      className="text-sm md:text-base text-[var(--ivory-200)] hover:text-[var(--ivory-50)] transition-colors duration-200"
                    >
                      {skillName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
