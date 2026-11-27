import { useRef } from "react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Experience({ bg = "primary" }: { bg?: "primary" | "secondary" }) {
  const { experience } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const items = Array.isArray(experience) ? experience : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".exp-header", {
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

        const rows = gsap.utils.toArray<HTMLElement>(".exp-item");
        rows.forEach((row) => {
          gsap.from(row, {
            y: 18,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              once: true,
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".exp-header", ".exp-item"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="exp-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 md:mb-16">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Experience
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-lg">
              Professional engineering roles, internships, and industry contributions.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
            Professional experience records will appear here as roles are published.
          </div>
        ) : (
          <div className="border-t border-[var(--hairline-rule)]">
            {items.map((item) => {
              const dateRange = `${item.startDate} – ${item.isCurrent ? "Present" : item.endDate || "Present"}`;
              const descriptions = Array.isArray(item.description)
                ? item.description.filter((d) => typeof d === "string" && d.trim().length > 0)
                : [];
              const skills = Array.isArray(item.skills) ? item.skills : [];
              const metaParts = [item.employmentType, item.location].filter(Boolean);

              return (
                <article
                  key={item.id}
                  className="exp-item grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-9 md:py-11 border-b border-[var(--hairline-rule)] items-start"
                >
                  <div className="md:col-span-4 space-y-1.5">
                    <p className="text-xs font-mono tracking-[0.06em] text-[var(--ivory-200)]">
                      {dateRange}
                    </p>
                    {metaParts.length > 0 && (
                      <p className="text-xs tracking-[0.08em] uppercase text-[var(--stone-400)]">
                        {metaParts.join(" · ")}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-8">
                    <h3 className="font-display text-2xl md:text-3xl tracking-[-0.015em] text-[var(--ivory-50)]">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--ivory-200)]">
                      {item.company}
                    </p>

                    {descriptions.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {descriptions.map((line, idx) => (
                          <li
                            key={idx}
                            className="pl-4 relative text-sm text-[var(--stone-400)] leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:bg-[var(--stone-500)]"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}

                    {skills.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
                        {skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="text-[11px] tracking-[0.08em] uppercase text-[var(--stone-400)]"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
