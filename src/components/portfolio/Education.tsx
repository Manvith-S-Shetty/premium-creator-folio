import { useRef } from "react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface NormalizedEducation {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  duration: string;
  cgpa?: string;
  location?: string;
}

export function Education({ bg = "secondary" }: { bg?: "primary" | "secondary" }) {
  const { education, personalInfo } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const records: NormalizedEducation[] =
    Array.isArray(education) && education.length > 0
      ? education.map((ed) => ({
          id: ed.id,
          degree: ed.degree,
          institution: ed.institution,
          fieldOfStudy: ed.fieldOfStudy,
          duration: ed.duration,
          cgpa: ed.cgpa,
          location: ed.location,
        }))
      : "education" in personalInfo && personalInfo.education
        ? [
            {
              id: "primary-education",
              degree: personalInfo.education.degree,
              institution: personalInfo.education.institution,
              duration: personalInfo.education.duration,
              cgpa: personalInfo.education.cgpa,
            },
          ]
        : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".edu-header", {
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

        gsap.from(".edu-row", {
          y: 16,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".edu-list",
            start: "top 84%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".edu-header", ".edu-row"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef, dependencies: [records.length] },
  );

  return (
    <section
      id="education"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="edu-header lg:col-span-4">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Education
            </h2>
            <p className="mt-4 text-sm text-[var(--stone-400)] leading-relaxed max-w-xs">
              Academic foundation in computer science and systems engineering.
            </p>
          </div>

          <div className="lg:col-span-8">
            {records.length === 0 ? (
              <div className="py-10 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
                Academic records are currently being updated.
              </div>
            ) : (
              <div className="edu-list border-t border-[var(--hairline-rule)]">
                {records.map((ed) => (
                  <article
                    key={ed.id}
                    className="edu-row py-8 border-b border-[var(--hairline-rule)] grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-baseline"
                  >
                    <div className="sm:col-span-4 space-y-1">
                      <p className="text-xs font-mono tracking-[0.06em] text-[var(--ivory-200)]">
                        {ed.duration}
                      </p>
                      {ed.location && (
                        <p className="text-xs tracking-[0.08em] uppercase text-[var(--stone-400)]">
                          {ed.location}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-8">
                      <h3 className="font-display text-2xl md:text-3xl tracking-[-0.015em] text-[var(--ivory-50)]">
                        {ed.degree}
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-[var(--ivory-200)]">
                        {ed.institution}
                      </p>
                      {ed.fieldOfStudy && (
                        <p className="mt-1 text-sm text-[var(--stone-400)]">{ed.fieldOfStudy}</p>
                      )}
                      {ed.cgpa && (
                        <p className="mt-4 text-xs font-mono tracking-[0.06em] uppercase text-[var(--stone-400)]">
                          CGPA {ed.cgpa}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
