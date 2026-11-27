import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

function hasValidUrl(v: string | undefined | null): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim() !== "#";
}

export function Achievements({ bg = "secondary" }: { bg?: "primary" | "secondary" }) {
  const { achievements } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const items = Array.isArray(achievements) ? achievements : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ach-header", {
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

        gsap.from(".ach-item", {
          y: 16,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".ach-list",
            start: "top 84%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".ach-header", ".ach-item"], {
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
      id="achievements"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="ach-header lg:col-span-4">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Achievements
            </h2>
            <p className="mt-4 text-sm text-[var(--stone-400)] leading-relaxed max-w-xs">
              Selected honors, competitive recognitions, and milestones.
            </p>
          </div>

          <div className="lg:col-span-8">
            {items.length === 0 ? (
              <div className="py-10 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
                Achievements will appear here as recognitions are published.
              </div>
            ) : (
              <div className="ach-list border-t border-[var(--hairline-rule)]">
                {items.map((achievement) => {
                  const metaParts = [achievement.dateAwarded, achievement.issuer].filter(Boolean);

                  return (
                    <article
                      key={achievement.id}
                      className="ach-item py-8 border-b border-[var(--hairline-rule)]"
                    >
                      {metaParts.length > 0 && (
                        <p className="text-xs font-mono tracking-[0.06em] uppercase text-[var(--stone-400)] mb-2">
                          {metaParts.join(" · ")}
                        </p>
                      )}

                      <h3 className="font-display text-2xl md:text-3xl tracking-[-0.015em] text-[var(--ivory-50)]">
                        {achievement.title}
                      </h3>

                      {achievement.description && (
                        <p className="mt-3 text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-2xl">
                          {achievement.description}
                        </p>
                      )}

                      {hasValidUrl(achievement.linkUrl) && (
                        <div className="mt-5">
                          <a
                            href={achievement.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:text-[var(--ivory-200)] border-b border-[var(--hairline-rule-lit)] pb-1 transition-colors"
                          >
                            <span>View Reference</span>
                            <ArrowUpRight
                              size={13}
                              aria-hidden="true"
                              className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            />
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
