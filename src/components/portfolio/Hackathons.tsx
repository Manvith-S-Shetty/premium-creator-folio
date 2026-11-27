import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

function hasValidUrl(v: string | undefined | null): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim() !== "#";
}

export function Hackathons({ bg = "primary" }: { bg?: "primary" | "secondary" }) {
  const { hackathons } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const items = Array.isArray(hackathons) ? hackathons : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hack-header", {
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

        const rows = gsap.utils.toArray<HTMLElement>(".hack-item");
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
        gsap.set([".hack-header", ".hack-item"], {
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
      id="hackathons"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="hack-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 md:mb-16">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Hackathons
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-lg">
              Competitive engineering sprints and rapid problem-solving builds.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
            Hackathon records will appear here as events are published.
          </div>
        ) : (
          <div className="border-t border-[var(--hairline-rule)]">
            {items.map((hackathon) => {
              const metaParts = [hackathon.dateHeld, hackathon.position].filter(Boolean);

              return (
                <article
                  key={hackathon.id}
                  className="hack-item grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-9 border-b border-[var(--hairline-rule)] items-start"
                >
                  <div className="md:col-span-4 space-y-1.5">
                    {metaParts.length > 0 && (
                      <p className="text-xs font-mono tracking-[0.06em] text-[var(--ivory-200)]">
                        {metaParts.join(" · ")}
                      </p>
                    )}
                    <p className="text-xs tracking-[0.08em] uppercase text-[var(--stone-400)]">
                      {hackathon.organizer}
                    </p>
                  </div>

                  <div className="md:col-span-8">
                    <h3 className="font-display text-2xl md:text-3xl tracking-[-0.015em] text-[var(--ivory-50)]">
                      {hackathon.name}
                    </h3>

                    {hackathon.description && (
                      <p className="mt-3 text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-2xl">
                        {hackathon.description}
                      </p>
                    )}

                    {hasValidUrl(hackathon.certificateUrl) && (
                      <div className="mt-5">
                        <a
                          href={hackathon.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:text-[var(--ivory-200)] border-b border-[var(--hairline-rule-lit)] pb-1 transition-colors"
                        >
                          <span>View Certificate</span>
                          <ArrowUpRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          />
                        </a>
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
