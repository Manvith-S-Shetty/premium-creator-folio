import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Github, Linkedin, Send, Check } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { Section } from "./Section";
import { contactApi } from "@/lib/api/contact.api";

function has(v: string) {
  return typeof v === "string" && v.trim().length > 0 && v !== "#";
}

export function Contact() {
  const { personalInfo, socialLinks: dbSocialLinks } = usePortfolioData();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const socialLinksMap =
    Array.isArray(dbSocialLinks) && dbSocialLinks.length > 0
      ? dbSocialLinks.reduce(
          (acc, curr) => ({ ...acc, [curr.platform]: curr.url }),
          {} as Record<string, string>,
        )
      : {
          github: "https://github.com/Manvith-S-Shetty",
          linkedin: "https://linkedin.com/in/manvith-s-shetty-51b16b283",
          email: personalInfo.email || "manumanvith06@gmail.com",
        };

  const contactEmail = personalInfo.email || socialLinksMap.email;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell me your name";

    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "A valid email helps me reply";

    if (!form.subject.trim()) next.subject = "Please enter a subject";

    if (form.message.trim().length < 10)
      next.message = "Please write at least 10 characters so I have context";

    setErrors(next);
    if (Object.keys(next).length) return;

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
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white/[0.03] border border-border rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30 transition-colors";

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something"
      description="Have an idea, a role, or just want to say hi? My inbox is open."
    >
      <div className="grid md:grid-cols-5 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:col-span-2 flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl text-gradient mb-2">Get in Touch</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fill out the form below and I'll get back to you soon.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {has(contactEmail) && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3.5 group p-2 -mx-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl border border-border grid place-items-center bg-white/[0.03] group-hover:border-foreground/30 transition-colors">
                    <Mail size={18} className="text-foreground/80" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Email
                    </div>
                    <div className="text-sm text-foreground/90 font-medium group-hover:text-cyan-400 transition-colors">
                      {contactEmail}
                    </div>
                  </div>
                </a>
              )}
              <div className="flex items-center gap-3.5 p-2 -mx-2">
                <div className="h-10 w-10 shrink-0 rounded-xl border border-border grid place-items-center bg-white/[0.03]">
                  <MapPin size={18} className="text-foreground/80" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Location
                  </div>
                  <div className="text-sm text-foreground/90 font-medium">
                    {personalInfo.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-3 font-medium">Social Profiles</div>
            <div className="flex items-center gap-3">
              {has(socialLinksMap.github) && (
                <a
                  href={socialLinksMap.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03] hover:border-foreground/30 hover:text-cyan-400 transition-colors"
                >
                  <Github size={18} />
                </a>
              )}
              {has(socialLinksMap.linkedin) && (
                <a
                  href={socialLinksMap.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03] hover:border-foreground/30 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="glass-card p-8 md:col-span-3 flex flex-col justify-between h-full space-y-5"
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

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-xs text-destructive mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                className={inputCls}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Job Opportunity"
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1.5">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                className={inputCls + " resize-none"}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the project, role, or idea…"
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1.5">{errors.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
            <div className="text-xs text-muted-foreground">
              {sent ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Check size={14} /> Message sent successfully!
                </span>
              ) : (
                "I usually reply within a day or two."
              )}
            </div>
            <button
              disabled={loading}
              type="submit"
              className="inline-flex items-center gap-2 rounded-full accent-gradient text-white px-5 py-2.5 text-sm font-medium shadow-[var(--shadow-glow)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Sending..." : "Send message"} <Send size={14} />
            </button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
