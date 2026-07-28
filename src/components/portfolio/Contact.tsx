import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Github, Linkedin, Send, Check } from "lucide-react";
import { personalInfo, socialLinks } from "@/config/data";
import { Section } from "./Section";

function has(v: string) {
  return typeof v === "string" && v.trim().length > 0 && v !== "#";
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell me your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "A valid email helps me reply";
    if (form.message.trim().length < 10) next.message = "A little more context please";
    setErrors(next);
    if (Object.keys(next).length) return;
    if (has(socialLinks.email)) {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`;
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
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
      <div className="grid md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:col-span-2 flex flex-col gap-5"
        >
          {has(socialLinks.email) && (
            <a href={`mailto:${socialLinks.email}`} className="flex items-start gap-3 group">
              <div className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03] group-hover:border-foreground/30 transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="text-sm text-foreground/90">{socialLinks.email}</div>
              </div>
            </a>
          )}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03]">
              <MapPin size={16} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Location</div>
              <div className="text-sm text-foreground/90">{personalInfo.location}</div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            {has(socialLinks.github) && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03] hover:border-foreground/30 transition-colors"
              >
                <Github size={16} />
              </a>
            )}
            {has(socialLinks.linkedin) && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 rounded-xl border border-border grid place-items-center bg-white/[0.03] hover:border-foreground/30 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="glass-card p-8 md:col-span-3 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
              <input
                className={inputCls + " mt-2"}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                className={inputCls + " mt-2"}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Message
            </label>
            <textarea
              rows={5}
              className={inputCls + " mt-2 resize-none"}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me about the project, role, or idea…"
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              {sent ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Check size={14} /> Opening your mail client…
                </span>
              ) : (
                "I usually reply within a day or two."
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full accent-gradient text-white px-5 py-2.5 text-sm font-medium shadow-[var(--shadow-glow)] hover:brightness-110 transition"
            >
              Send message <Send size={14} />
            </button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
