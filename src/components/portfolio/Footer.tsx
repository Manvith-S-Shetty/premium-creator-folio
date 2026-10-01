import { ArrowUp, Github, Linkedin, Mail, Code2 } from "lucide-react";
import { navigation, personalInfo, socialLinks } from "@/config/data";

function has(v: string) {
  return typeof v === "string" && v.trim().length > 0 && v !== "#";
}

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { key: "github", Icon: Github, href: socialLinks.github, label: "GitHub" },
    { key: "linkedin", Icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { key: "leetcode", Icon: Code2, href: socialLinks.leetcode, label: "LeetCode" },
    {
      key: "email",
      Icon: Mail,
      href: socialLinks.email ? `mailto:${socialLinks.email}` : "",
      label: "Email",
    },
  ].filter((s) => has(s.href));

  return (
    <footer className="relative border-t border-border mt-10">
      <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="font-display text-xl text-gradient">{personalInfo.displayName}</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">{personalInfo.taglineShort}</p>
        </div>

        <nav className="flex flex-wrap md:flex-nowrap gap-x-5 gap-y-2 md:justify-center text-sm text-muted-foreground">
          {navigation.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex md:justify-end items-center gap-2.5">
          <div className="flex items-center gap-2.5">
            {socials.map(({ key, Icon, href, label }) => (
              <a
                key={key}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                className="h-9 w-9 rounded-xl border border-border bg-white/[0.03] grid place-items-center hover:border-foreground/30 hover:text-cyan-400 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <div className="h-4 w-px bg-border/60 mx-1" aria-hidden="true" />

          <a
            href="#hero"
            className="h-9 w-9 rounded-xl accent-gradient grid place-items-center text-white shadow-md hover:brightness-110 transition cursor-pointer"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={15} />
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {year} {personalInfo.name}. All rights reserved.
          </span>
          <span>Crafted with care</span>
        </div>
      </div>
    </footer>
  );
}
