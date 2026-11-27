import { useRef } from "react";
import { ArrowRight, Download, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

function has(v: string) {
  return typeof v === "string" && v.trim().length > 0 && v !== "#";
}

function isValidWebUrl(v: string | undefined | null): boolean {
  if (!v || typeof v !== "string") return false;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed === "#") return false;
  if (trimmed.startsWith("file:") || /^[a-zA-Z]:\\/.test(trimmed)) return false;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/");
}

export function Hero() {
  const { personalInfo, resumeUrl, socialLinks: dbSocialLinks } = usePortfolioData();
  const isResumeAvailable = isValidWebUrl(resumeUrl);
  const heroRef = useRef<HTMLElement>(null);

  const socialLinksMap =
    Array.isArray(dbSocialLinks) && dbSocialLinks.length > 0
      ? dbSocialLinks.reduce(
          (acc, curr) => ({ ...acc, [curr.platform]: curr.url }),
          {} as Record<string, string>,
        )
      : {
          github: "https://github.com/Manvith-S-Shetty",
          linkedin: "https://linkedin.com/in/manvith-s-shetty-51b16b283",
          instagram: "https://www.instagram.com/the.day_._dreamer.____",
        };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-status", {
          y: 12,
          autoAlpha: 0,
          duration: 0.6,
          clearProps: "transform",
        })
          .from(
            ".hero-title",
            {
              y: 24,
              autoAlpha: 0,
              duration: 0.85,
              clearProps: "transform",
            },
            "-=0.4",
          )
          .from(
            ".hero-role",
            {
              y: 16,
              autoAlpha: 0,
              duration: 0.7,
              clearProps: "transform",
            },
            "-=0.55",
          )
          .from(
            ".hero-rule",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.7,
              clearProps: "transform",
            },
            "-=0.5",
          )
          .from(
            ".hero-bio",
            {
              y: 14,
              autoAlpha: 0,
              duration: 0.7,
              clearProps: "transform",
            },
            "-=0.5",
          )
          .from(
            ".hero-actions",
            {
              y: 12,
              autoAlpha: 0,
              duration: 0.65,
              clearProps: "transform",
            },
            "-=0.45",
          )
          .from(
            ".hero-portrait",
            {
              y: 18,
              scale: 1.03,
              autoAlpha: 0,
              duration: 0.95,
              clearProps: "transform",
            },
            0.15,
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".hero-status",
            ".hero-title",
            ".hero-role",
            ".hero-rule",
            ".hero-bio",
            ".hero-actions",
            ".hero-portrait",
          ],
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            clearProps: "transform",
          },
        );
      });
    },
    { scope: heroRef },
  );

  const displayName =
    personalInfo.displayName ||
    ("fullName" in personalInfo ? personalInfo.fullName : personalInfo.name);
  const fullName = "fullName" in personalInfo ? personalInfo.fullName : personalInfo.name;
  const primaryTitle =
    "primaryTitle" in personalInfo ? personalInfo.primaryTitle : personalInfo.title;
  const isAvailable = "isAvailable" in personalInfo ? personalInfo.isAvailable : true;

  const roleLine =
    personalInfo.taglineShort || `${primaryTitle || "Software Engineer"} · AI/ML Enthusiast`;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden bg-[var(--obsidian-950)]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-grid opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="hero-status inline-flex items-center gap-2.5 text-xs tracking-[0.14em] uppercase text-[var(--stone-400)] mb-6">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isAvailable ? "bg-[var(--ivory-200)]" : "bg-[var(--stone-500)]",
              )}
              aria-hidden="true"
            />
            <span>{isAvailable ? "Available for new opportunities" : "Currently unavailable"}</span>
          </div>

          <h1 className="hero-title font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.98] tracking-[-0.025em] text-[var(--ivory-50)]">
            {displayName}
          </h1>

          <p className="hero-role mt-5 text-base sm:text-lg md:text-xl font-normal tracking-tight text-[var(--ivory-200)]">
            {roleLine}
          </p>

          <div className="hero-rule editorial-hairline my-7 max-w-md" aria-hidden="true" />

          <p className="hero-bio max-w-xl text-base md:text-[1.0625rem] text-[var(--stone-400)] leading-[1.7]">
            {personalInfo.bio}
          </p>

          <div className="hero-actions mt-9 space-y-6">
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2.5 rounded-sm bg-[var(--ivory-50)] text-[var(--obsidian-950)] px-6 py-3.5 text-xs font-medium tracking-[0.08em] uppercase hover:bg-[var(--ivory-200)] transition-colors duration-200"
              >
                <Mail size={15} />
                Contact
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              {isResumeAvailable ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  aria-label="Download Resume"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-sm border border-[var(--hairline-rule-lit)] bg-transparent px-6 py-3.5 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:border-[var(--ivory-200)] hover:bg-[var(--charcoal-800)] transition-colors duration-200"
                >
                  <Download size={15} />
                  Resume
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  aria-label="Resume unavailable"
                  title="Resume unavailable"
                  className="inline-flex items-center justify-center gap-2.5 rounded-sm border border-[var(--hairline-rule)] bg-transparent px-6 py-3.5 text-xs font-medium tracking-[0.08em] uppercase opacity-40 cursor-not-allowed text-[var(--stone-400)]"
                >
                  <Download size={15} />
                  Resume
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              {[
                { key: "github", label: "GitHub", Icon: Github, href: socialLinksMap.github },
                {
                  key: "linkedin",
                  label: "LinkedIn",
                  Icon: Linkedin,
                  href: socialLinksMap.linkedin,
                },
                {
                  key: "instagram",
                  label: "Instagram",
                  Icon: Instagram,
                  href: socialLinksMap.instagram,
                },
              ]
                .filter((b) => has(b.href))
                .map(({ key, label, Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-xs tracking-[0.06em] uppercase text-[var(--stone-400)] hover:text-[var(--ivory-50)] transition-colors duration-200"
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end">
          <figure className="hero-portrait w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[390px] border border-[var(--hairline-rule-lit)] bg-[var(--charcoal-800)]/40 p-2.5">
            <div className="overflow-hidden bg-[var(--charcoal-800)]">
              <img
                src={personalInfo.photoUrl || "/images/me.jpeg"}
                alt={fullName}
                width={390}
                height={488}
                className="w-full aspect-[4/5] object-cover grayscale-[35%] contrast-[1.06] brightness-[0.98] transition-all duration-500 hover:grayscale-[15%]"
              />
            </div>
            {personalInfo.location && (
              <figcaption className="mt-2.5 px-1 flex items-center justify-between text-[11px] tracking-[0.14em] uppercase text-[var(--stone-400)]">
                <span>{personalInfo.location}</span>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}
