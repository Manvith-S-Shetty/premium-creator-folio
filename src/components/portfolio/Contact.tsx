import { useRef, useState, type FormEvent } from "react";
import { Check, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { socialLinks as staticSocialLinks } from "@/config/data";
import { contactApi } from "@/lib/api/contact.api";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

function hasValidValue(v: string | undefined | null): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim() !== "#";
}

export function Contact({ bg = "secondary" }: { bg?: "primary" | "secondary" }) {
  const { personalInfo, socialLinks: dbSocialLinks } = usePortfolioData();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const personalEmail =
    "email" in personalInfo && typeof personalInfo.email === "string" ? personalInfo.email : "";

  const socialLinksMap =
    Array.isArray(dbSocialLinks) && dbSocialLinks.length > 0
      ? dbSocialLinks.reduce(
          (acc, curr) => ({ ...acc, [curr.platform]: curr.url }),
          {} as Record<string, string>,
        )
      : {
          github: staticSocialLinks.github,
          linkedin: staticSocialLinks.linkedin,
          email: personalEmail || staticSocialLinks.email,
        };

  const contactEmail = personalEmail || socialLinksMap.email || staticSocialLinks.email;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-info", {
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

        gsap.from(".contact-form", {
          y: 20,
          autoAlpha: 0,
          duration: 0.75,
          delay: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".contact-info", ".contact-form"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef },
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Please tell me your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "A valid email helps me reply";
    if (!form.subject.trim()) next.subject = "Please enter a subject";
    if (form.message.trim().length < 10) {
      next.message = "Please write at least 10 characters so I have context";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await contactApi.submitMessage(form);
      setSent(true);
      setErrors({});
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (error) {
      setSent(false);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[var(--charcoal-800)]/60 border border-[var(--hairline-rule)] rounded-sm px-4 py-3 text-sm text-[var(--ivory-50)] outline-none placeholder:text-[var(--stone-500)] focus:border-[var(--ivory-200)] transition-colors duration-200";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="contact-info lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
                Let's build something
              </h2>
              <p className="mt-4 text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-sm">
                Have an engineering role, collaboration, or product idea in mind? Send a note below.
              </p>
            </div>

            <div className="border-t border-[var(--hairline-rule)] pt-7 space-y-5">
              {hasValidValue(contactEmail) && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-3.5 group text-[var(--ivory-200)] hover:text-[var(--ivory-50)] transition-colors"
                >
                  <Mail
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--stone-400)] group-hover:text-[var(--ivory-50)] transition-colors"
                  />
                  <div>
                    <p className="text-[11px] tracking-[0.12em] uppercase text-[var(--stone-400)]">
                      Email
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{contactEmail}</p>
                  </div>
                </a>
              )}

              {hasValidValue(personalInfo.location) && (
                <div className="flex items-start gap-3.5 text-[var(--ivory-200)]">
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--stone-400)]"
                  />
                  <div>
                    <p className="text-[11px] tracking-[0.12em] uppercase text-[var(--stone-400)]">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{personalInfo.location}</p>
                  </div>
                </div>
              )}
            </div>

            {(hasValidValue(socialLinksMap.github) || hasValidValue(socialLinksMap.linkedin)) && (
              <div className="border-t border-[var(--hairline-rule)] pt-7">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[var(--stone-400)] mb-4">
                  Social Profiles
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  {hasValidValue(socialLinksMap.github) && (
                    <a
                      href={socialLinksMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.08em] uppercase text-[var(--ivory-200)] hover:text-[var(--ivory-50)] transition-colors"
                    >
                      <Github size={15} aria-hidden="true" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {hasValidValue(socialLinksMap.linkedin) && (
                    <a
                      href={socialLinksMap.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.08em] uppercase text-[var(--ivory-200)] hover:text-[var(--ivory-50)] transition-colors"
                    >
                      <Linkedin size={15} aria-hidden="true" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="contact-form lg:col-span-7 border border-[var(--hairline-rule)] bg-[var(--obsidian-950)]/60 p-6 sm:p-8 md:p-10 space-y-6"
          >
            {/* Honeypot anti-spam hidden field */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-[11px] uppercase tracking-[0.12em] text-[var(--stone-400)] font-medium mb-2"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="contact-name-error" role="alert" className="text-xs text-red-400 mt-1.5">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[11px] uppercase tracking-[0.12em] text-[var(--stone-400)] font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="contact-email-error" role="alert" className="text-xs text-red-400 mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-[11px] uppercase tracking-[0.12em] text-[var(--stone-400)] font-medium mb-2"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                className={inputCls}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Engineering role or project inquiry"
              />
              {errors.subject && (
                <p id="contact-subject-error" role="alert" className="text-xs text-red-400 mt-1.5">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-[11px] uppercase tracking-[0.12em] text-[var(--stone-400)] font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                className={cn(inputCls, "resize-none")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the project, role, or idea…"
              />
              {errors.message && (
                <p id="contact-message-error" role="alert" className="text-xs text-red-400 mt-1.5">
                  {errors.message}
                </p>
              )}
            </div>

            {submitError && (
              <div
                role="alert"
                className="border border-red-400/30 bg-red-950/20 px-4 py-3 text-xs text-red-300"
              >
                {submitError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--hairline-rule)]">
              <div className="text-xs text-[var(--stone-400)]" aria-live="polite">
                {sent ? (
                  <span className="inline-flex items-center gap-2 text-[var(--ivory-50)] font-medium">
                    <Check size={14} aria-hidden="true" />
                    <span>Message sent successfully.</span>
                  </span>
                ) : (
                  <span>I usually reply within a day or two.</span>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--ivory-50)] text-[var(--obsidian-950)] px-6 py-3 text-xs font-medium tracking-[0.08em] uppercase hover:bg-[var(--ivory-200)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                <Send size={13} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
