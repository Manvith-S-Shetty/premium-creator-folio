import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/config/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const y = window.scrollY + 120;
      let current = "#hero";
      for (const item of navigation) {
        const el = document.querySelector(item.href);
        if (el instanceof HTMLElement && el.offsetTop <= y) {
          current = item.href;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(headerRef.current, {
          y: -16,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "transform",
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(headerRef.current, {
          y: 0,
          autoAlpha: 1,
        });
      });
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      if (!open || !mobileMenuRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".mobile-nav-item",
          { y: 8, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform",
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".mobile-nav-item", { y: 0, autoAlpha: 1 });
      });
    },
    { scope: mobileMenuRef, dependencies: [open] },
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 transition-colors duration-300 border-b",
        scrolled
          ? "bg-[var(--obsidian-900)]/92 backdrop-blur-md border-[var(--hairline-rule)]"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-2xl tracking-tight text-[var(--ivory-50)] hover:text-[var(--ivory-200)] transition-colors duration-200"
        >
          Manvith<span className="text-[var(--stone-400)]">.</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {navigation.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative py-1 text-xs font-medium tracking-[0.06em] uppercase transition-colors duration-200",
                  isActive
                    ? "text-[var(--ivory-50)]"
                    : "text-[var(--stone-400)] hover:text-[var(--ivory-200)]",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px bg-[var(--ivory-200)] transition-transform duration-300 origin-left",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase rounded-sm border border-[var(--hairline-rule-lit)] text-[var(--ivory-50)] hover:bg-[var(--ivory-50)] hover:text-[var(--obsidian-950)] transition-colors duration-200"
        >
          Let's talk
        </a>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-sm p-2 border border-[var(--hairline-rule-lit)] text-[var(--ivory-50)] hover:bg-[var(--charcoal-800)] transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav-menu"
          ref={mobileMenuRef}
          className="md:hidden border-b border-[var(--hairline-rule)] bg-[var(--obsidian-950)]/96 backdrop-blur-xl"
        >
          <nav aria-label="Mobile navigation" className="px-6 py-5 flex flex-col">
            {navigation.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "mobile-nav-item py-3 text-sm tracking-[0.06em] uppercase border-b border-[var(--hairline-rule)] last:border-b-0 transition-colors",
                    isActive
                      ? "text-[var(--ivory-50)] font-medium"
                      : "text-[var(--stone-400)] hover:text-[var(--ivory-200)]",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mobile-nav-item mt-4 inline-flex items-center justify-center px-4 py-3 text-xs font-medium tracking-[0.08em] uppercase rounded-sm bg-[var(--ivory-50)] text-[var(--obsidian-950)] hover:bg-[var(--ivory-200)] transition-colors"
            >
              Let's talk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
