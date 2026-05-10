"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, profile } from "@/lib/data";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);

      // Special case for home to go to where Hero becomes visible (after SpaceIntro pinning)
      if (href === "#home") {
        setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight * 4,
            behavior: "smooth",
          });
        }, 10);
        return;
      }

      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        // Small delay to allow menu closing animation to start and avoid layout shifts
        setTimeout(() => {
          const offset = 80;
          const elementPosition = elem.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 10);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-6xl flex-col rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-panel backdrop-blur-xl transition-all">
        <div className="flex w-full items-center justify-between">
          <a
            href="#home"
            onClick={(e) => handleScroll(e, "#home")}
            className="flex items-center gap-3 font-semibold text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-300/30 bg-brand-300/12 text-sm text-brand-100 shadow-glow">
              A
            </span>
            <span className="hidden sm:inline">{profile.shortName}</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="hidden rounded-lg border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-400 hover:text-slate-950 md:inline-flex"
            >
              Hire Me
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-2 pt-4 pb-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full rounded-lg border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-center text-sm font-medium text-brand-100 transition hover:bg-brand-400 hover:text-slate-950"
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
