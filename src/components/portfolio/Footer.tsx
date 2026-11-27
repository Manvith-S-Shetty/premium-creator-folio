import { ArrowUp, Code2, Github, Linkedin, Mail } from "lucide-react";
import {
  navigation,
  personalInfo as staticPersonalInfo,
  socialLinks as staticSocialLinks,
} from "@/config/data";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";

function hasValidValue(v: string | undefined | null): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim() !== "#";
}

export function Footer() {
  const { personalInfo, socialLinks: dbSocialLinks } = usePortfolioData();
  const year = new Date().getFullYear();

  const displayName =
    personalInfo.displayName ||
    ("fullName" in personalInfo ? personalInfo.fullName : personalInfo.name);
  const fullName = "fullName" in personalInfo ? personalInfo.fullName : personalInfo.name;
  const tagline = personalInfo.taglineShort || staticPersonalInfo.taglineShort;
  const personalEmail =
    "email" in personalInfo && typeof personalInfo.email === "string" ? personalInfo.email : "";

  const socialMap =
    Array.isArray(dbSocialLinks) && dbSocialLinks.length > 0
      ? dbSocialLinks.reduce(
          (acc, curr) => ({ ...acc, [curr.platform]: curr.url }),
          {} as Record<string, string>,
        )
      : {
          github: staticSocialLinks.github,
          linkedin: staticSocialLinks.linkedin,
          leetcode: staticSocialLinks.leetcode,
          email: personalEmail || staticSocialLinks.email,
        };

  const emailAddress = personalEmail || socialMap.email || staticSocialLinks.email;

  const socials = [
    { key: "github", Icon: Github, href: socialMap.github, label: "GitHub" },
    { key: "linkedin", Icon: Linkedin, href: socialMap.linkedin, label: "LinkedIn" },
    { key: "leetcode", Icon: Code2, href: socialMap.leetcode, label: "LeetCode" },
    {
      key: "email",
      Icon: Mail,
      href: hasValidValue(emailAddress) ? `mailto:${emailAddress}` : "",
      label: "Email",
    },
  ].filter((s) => hasValidValue(s.href));

  return (
    <footer className="relative border-t border-[var(--hairline-rule)] bg-[var(--obsidian-950)]">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4">
          <div className="font-display text-2xl tracking-tight text-[var(--ivory-50)]">
            {displayName}
          </div>
          {tagline && <p className="mt-2 text-xs text-[var(--stone-400)] max-w-xs">{tagline}</p>}
        </div>

        <nav
          aria-label="Footer navigation"
          className="md:col-span-5 flex flex-wrap gap-x-6 gap-y-2.5 md:justify-center text-xs tracking-[0.06em] uppercase text-[var(--stone-400)]"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[var(--ivory-50)] transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="md:col-span-3 flex md:justify-end items-center gap-3">
          {socials.map(({ key, Icon, href, label }) => (
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="h-9 w-9 rounded-sm border border-[var(--hairline-rule)] grid place-items-center text-[var(--stone-400)] hover:border-[var(--hairline-rule-lit)] hover:text-[var(--ivory-50)] transition-colors"
            >
              <Icon size={15} aria-hidden="true" />
            </a>
          ))}

          <div className="h-4 w-px bg-[var(--hairline-rule)] mx-1" aria-hidden="true" />

          <a
            href="#hero"
            aria-label="Back to top"
            title="Back to top"
            className="h-9 w-9 rounded-sm border border-[var(--hairline-rule-lit)] grid place-items-center text-[var(--ivory-50)] hover:bg-[var(--ivory-50)] hover:text-[var(--obsidian-950)] transition-colors"
          >
            <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--hairline-rule)]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--stone-400)]">
          <span>
            © {year} {fullName}. All rights reserved.
          </span>
          <span className="tracking-[0.06em] uppercase text-[11px]">Software Engineering</span>
        </div>
      </div>
    </footer>
  );
}
