"use client";

import { motion } from "framer-motion";
import { navItems, profile } from "@/lib/data";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-panel backdrop-blur-xl">
        <a href="#home" className="flex items-center gap-3 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-300/30 bg-brand-300/12 text-sm text-brand-100 shadow-glow">A</span>
          <span className="hidden sm:inline">{profile.shortName}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="rounded-lg border border-brand-300/30 bg-brand-400/10 px-4 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-400 hover:text-slate-950"
        >
          Hire Me
        </a>
      </nav>
    </motion.header>
  );
}
