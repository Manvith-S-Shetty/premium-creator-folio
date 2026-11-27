import { useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import type { Project } from "@/config/data";
import type { ProjectDTO } from "@/lib/types/cms.types";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface NormalizedProject {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  screenshot?: string;
  category?: string;
  status?: string;
}

function hasValidUrl(v: string | undefined | null): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim() !== "#";
}

function normalizeProject(p: Project | ProjectDTO): NormalizedProject {
  const isDto = "shortDescription" in p;
  const techStack =
    isDto && Array.isArray(p.skills) && p.skills.length > 0
      ? p.skills.map((s) => s.name)
      : !isDto && Array.isArray(p.techStack)
        ? p.techStack
        : [];
  const screenshot = isDto ? p.thumbnailUrl || p.screenshots?.[0] : undefined;

  return {
    id: p.id,
    title: p.title,
    description: isDto ? p.shortDescription : p.description,
    bullets: Array.isArray(p.bullets) ? p.bullets : [],
    techStack,
    githubUrl: p.githubUrl || "",
    liveUrl: p.liveUrl || "",
    screenshot,
    category: isDto ? p.category : undefined,
    status: isDto ? p.status : undefined,
  };
}

export function Projects({ bg = "secondary" }: { bg?: "primary" | "secondary" }) {
  const { projects } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const normalizedProjects = Array.isArray(projects) ? projects.map(normalizeProject) : [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".projects-header", {
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

        const dossiers = gsap.utils.toArray<HTMLElement>(".project-dossier");
        dossiers.forEach((dossier) => {
          gsap.from(dossier, {
            y: 24,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: dossier,
              start: "top 85%",
              once: true,
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".projects-header", ".project-dossier"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef, dependencies: [normalizedProjects.length] },
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="projects-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 md:mb-20">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Selected Projects
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-lg">
              A selection of full-stack applications, real-time platforms, and applied machine
              learning systems.
            </p>
          </div>
        </div>

        {normalizedProjects.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
            No published projects available at the moment.
          </div>
        ) : (
          <div className="border-t border-[var(--hairline-rule)]">
            {normalizedProjects.map((project, index) => {
              const hasMedia = Boolean(project.screenshot);
              const reverseMedia = index % 2 === 1;
              const metaItems = [project.category, project.status].filter(Boolean);

              return (
                <article
                  key={project.id}
                  className="project-dossier group py-14 md:py-20 border-b border-[var(--hairline-rule)]"
                >
                  {hasMedia ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                      <div
                        className={cn("lg:col-span-7", reverseMedia ? "lg:order-2" : "lg:order-1")}
                      >
                        <div className="overflow-hidden border border-[var(--hairline-rule)] bg-[var(--charcoal-800)]">
                          <img
                            src={project.screenshot}
                            alt={project.title}
                            width={840}
                            height={525}
                            className="w-full aspect-[16/10] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>

                      <div
                        className={cn(
                          "lg:col-span-5 flex flex-col justify-between",
                          reverseMedia ? "lg:order-1" : "lg:order-2",
                        )}
                      >
                        <div>
                          {metaItems.length > 0 && (
                            <p className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone-400)] mb-3">
                              {metaItems.join(" / ")}
                            </p>
                          )}

                          <h3 className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-[var(--ivory-50)]">
                            {project.title}
                          </h3>

                          <p className="mt-4 text-sm md:text-base text-[var(--ivory-200)] leading-relaxed">
                            {project.description}
                          </p>

                          {project.bullets.length > 0 && (
                            <ul className="mt-6 space-y-2.5">
                              {project.bullets.map((bullet, idx) => (
                                <li
                                  key={idx}
                                  className="pl-4 relative text-sm text-[var(--stone-400)] leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:bg-[var(--stone-500)]"
                                >
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--hairline-rule)] space-y-5">
                          {project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                              {project.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-xs tracking-[0.06em] uppercase text-[var(--stone-400)]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {(hasValidUrl(project.githubUrl) || hasValidUrl(project.liveUrl)) && (
                            <div className="flex flex-wrap items-center gap-4">
                              {hasValidUrl(project.githubUrl) && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/link inline-flex items-center gap-2 rounded-sm border border-[var(--hairline-rule-lit)] px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:border-[var(--ivory-200)] hover:bg-[var(--charcoal-800)] transition-colors duration-200"
                                >
                                  <Github size={14} aria-hidden="true" />
                                  <span>GitHub</span>
                                  <ArrowUpRight
                                    size={13}
                                    aria-hidden="true"
                                    className="opacity-70 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                  />
                                </a>
                              )}

                              {hasValidUrl(project.liveUrl) && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/link inline-flex items-center gap-2 rounded-sm bg-[var(--ivory-50)] px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--obsidian-950)] hover:bg-[var(--ivory-200)] transition-colors duration-200"
                                >
                                  <span>Live Demo</span>
                                  <ArrowUpRight
                                    size={13}
                                    aria-hidden="true"
                                    className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                  />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                      <div className="lg:col-span-5">
                        {metaItems.length > 0 && (
                          <p className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone-400)] mb-3">
                            {metaItems.join(" / ")}
                          </p>
                        )}

                        <h3 className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-[var(--ivory-50)]">
                          {project.title}
                        </h3>

                        {project.techStack.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs tracking-[0.06em] uppercase text-[var(--stone-400)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {(hasValidUrl(project.githubUrl) || hasValidUrl(project.liveUrl)) && (
                          <div className="mt-7 flex flex-wrap items-center gap-4">
                            {hasValidUrl(project.githubUrl) && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-2 rounded-sm border border-[var(--hairline-rule-lit)] px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:border-[var(--ivory-200)] hover:bg-[var(--charcoal-800)] transition-colors duration-200"
                              >
                                <Github size={14} aria-hidden="true" />
                                <span>GitHub</span>
                                <ArrowUpRight
                                  size={13}
                                  aria-hidden="true"
                                  className="opacity-70 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                />
                              </a>
                            )}

                            {hasValidUrl(project.liveUrl) && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-center gap-2 rounded-sm bg-[var(--ivory-50)] px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--obsidian-950)] hover:bg-[var(--ivory-200)] transition-colors duration-200"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight
                                  size={13}
                                  aria-hidden="true"
                                  className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-7">
                        <p className="text-base md:text-lg text-[var(--ivory-200)] leading-relaxed">
                          {project.description}
                        </p>

                        {project.bullets.length > 0 && (
                          <ul className="mt-6 space-y-2.5">
                            {project.bullets.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="pl-4 relative text-sm text-[var(--stone-400)] leading-relaxed before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:bg-[var(--stone-500)]"
                              >
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
