import { motion } from "motion/react";
import { ArrowRight, Download, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full blur-3xl opacity-40 accent-gradient" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 w-full grid md:grid-cols-[minmax(0,1fr)_320px] gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 md:order-1"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-md px-3 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {personalInfo.isAvailable ? "Available for new opportunities" : "Currently unavailable"}
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            <span className="text-gradient">
              {personalInfo.displayName || personalInfo.fullName}
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            {personalInfo.primaryTitle} ·{" "}
            <span className="text-foreground/80">AI/ML Enthusiast</span>
          </p>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {personalInfo.bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { key: "github", label: "GitHub", Icon: Github, href: socialLinksMap.github },
              { key: "linkedin", label: "LinkedIn", Icon: Linkedin, href: socialLinksMap.linkedin },
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
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/[0.03] backdrop-blur-md px-4 py-2 text-xs font-medium text-foreground/80",
                    "hover:bg-white/[0.08] hover:border-foreground/30 hover:text-foreground transition-all duration-200",
                  )}
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="order-1 md:order-2 flex flex-col items-center md:items-end gap-5"
        >
          <div className="relative group">
            <div className="absolute -inset-3 rounded-3xl accent-gradient opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
            <div className="relative rounded-[1.75rem] p-[1.5px] accent-gradient overflow-hidden">
              <img
                src={personalInfo.photoUrl || "/images/me.jpeg"}
                alt={personalInfo.fullName}
                width={360}
                height={400}
                className="rounded-2xl w-[300px] md:w-[380px] aspect-[4/5] object-cover bg-card transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </div>
          <div className="flex w-full gap-3.5 justify-center">
            {isResumeAvailable ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label="Download Resume"
                className="group flex-1 inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-card/60 backdrop-blur-md px-5 py-3.5 text-sm font-medium hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <Download size={16} />
                Resume
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                aria-label="Resume unavailable"
                title="Resume unavailable"
                className="group flex-1 inline-flex items-center justify-center gap-2.5 rounded-full border border-border/50 bg-card/30 backdrop-blur-md px-5 py-3.5 text-sm font-medium opacity-50 cursor-not-allowed text-muted-foreground"
              >
                <Download size={16} />
                Resume
                <ArrowRight size={14} />
              </button>
            )}
            <a
              href="#contact"
              className="group flex-1 inline-flex items-center justify-center gap-2 rounded-full accent-gradient text-white px-5 py-3.5 text-sm font-medium shadow-[var(--shadow-glow)] hover:brightness-110 transition-all duration-300"
            >
              <Mail size={16} />
              Contact
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
