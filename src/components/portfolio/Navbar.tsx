import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/config/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const y = window.scrollY + 120;
      let current = "#hero";
      for (const item of navigation) {
        const el = document.querySelector(item.href);
        if (el instanceof HTMLElement && el.offsetTop <= y) current = item.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-background/60 border-b border-border" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="font-display text-xl tracking-tight text-foreground">
          Manvith<span className="text-gradient">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/40 backdrop-blur-md p-1">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "px-3.5 py-1.5 text-sm rounded-full transition-colors",
                active === item.href
                  ? "text-foreground bg-white/[0.07]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border hover:border-foreground/40 transition-colors"
        >
          Let's talk
        </a>

        <button
          className="md:hidden rounded-md p-2 border border-border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/90 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
