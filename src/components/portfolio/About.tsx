import { useRef } from "react";
import { MapPin } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function About({ bg = "secondary" }: { bg?: "primary" | "secondary" }) {
  const { personalInfo } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const personalStory =
    "personalStory" in personalInfo && typeof personalInfo.personalStory === "string"
      ? personalInfo.personalStory.trim()
      : "";
  const careerObjective =
    typeof personalInfo.careerObjective === "string" ? personalInfo.careerObjective.trim() : "";
  const corePrinciples =
    "corePrinciples" in personalInfo && Array.isArray(personalInfo.corePrinciples)
      ? personalInfo.corePrinciples.filter(
          (item) => typeof item === "string" && item.trim().length > 0,
        )
      : [];
  const techInterests = Array.isArray(personalInfo.techInterests)
    ? personalInfo.techInterests.filter(
        (item) => typeof item === "string" && item.trim().length > 0,
      )
    : [];

  const primaryStatement = personalStory || careerObjective;
  const secondaryStatement = personalStory && careerObjective ? careerObjective : "";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });

        tl.from(".about-heading", {
          y: 20,
          autoAlpha: 0,
          duration: 0.75,
          clearProps: "transform",
        })
          .from(
            ".about-statement",
            {
              y: 18,
              autoAlpha: 0,
              duration: 0.75,
              clearProps: "transform",
            },
            "-=0.5",
          )
          .from(
            ".about-rule",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.65,
              clearProps: "transform",
            },
            "-=0.45",
          )
          .from(
            ".about-detail",
            {
              y: 14,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.1,
              clearProps: "transform",
            },
            "-=0.4",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".about-heading", ".about-statement", ".about-rule", ".about-detail"], {
          autoAlpha: 1,
          y: 0,
          scaleX: 1,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="about-heading lg:col-span-4">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Philosophy
            </h2>
            {personalInfo.location && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-[var(--stone-400)]">
                <MapPin size={13} aria-hidden="true" />
                <span>{personalInfo.location}</span>
              </p>
            )}
          </div>

          <div className="lg:col-span-8">
            {primaryStatement && (
              <p className="about-statement text-xl md:text-2xl leading-[1.55] font-light text-[var(--ivory-200)]">
                {primaryStatement}
              </p>
            )}

            {secondaryStatement && (
              <p className="about-statement mt-6 text-base leading-[1.75] text-[var(--stone-400)] max-w-2xl">
                {secondaryStatement}
              </p>
            )}

            {(techInterests.length > 0 || corePrinciples.length > 0) && (
              <>
                <div className="about-rule editorial-hairline my-10" aria-hidden="true" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {techInterests.length > 0 && (
                    <div className="about-detail">
                      <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[var(--stone-400)] mb-4">
                        Focus Areas
                      </h3>
                      <ul className="space-y-2.5">
                        {techInterests.map((interest) => (
                          <li
                            key={interest}
                            className="text-sm text-[var(--ivory-200)] pb-2 border-b border-[var(--hairline-rule)] last:border-b-0"
                          >
                            {interest}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {corePrinciples.length > 0 && (
                    <div className="about-detail">
                      <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[var(--stone-400)] mb-4">
                        Engineering Principles
                      </h3>
                      <ul className="space-y-2.5">
                        {corePrinciples.map((principle) => (
                          <li
                            key={principle}
                            className="text-sm text-[var(--ivory-200)] pb-2 border-b border-[var(--hairline-rule)] last:border-b-0"
                          >
                            {principle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
