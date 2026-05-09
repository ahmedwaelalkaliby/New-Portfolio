"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Code2, Layers3, Sparkles } from "lucide-react";

const railItems = [
  "UI SYSTEMS",
  "NEXT.JS",
  "TYPE SAFETY",
  "MOTION",
  "DASHBOARDS",
  "PRODUCT UX"
];

const featureCards = [
  {
    icon: Code2,
    label: "01/A",
    title: "Architecture",
    text: "Reusable React systems, clean routing, forms, and state patterns for fast product work."
  },
  {
    icon: Layers3,
    label: "01/B",
    title: "Interfaces",
    text: "Responsive screens with tight spacing, predictable hierarchy, and polished interaction states."
  },
  {
    icon: Sparkles,
    label: "01/C",
    title: "Motion",
    text: "Purposeful transitions and scroll moments that make the portfolio feel alive without slowing it down."
  }
];

export function LaunchScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const railX = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["28px", "-28px"]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-y border-white/10 bg-[#05070b] px-6 py-24 lg:min-h-[165vh] lg:py-0"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center overflow-hidden lg:sticky lg:top-0 lg:min-h-screen lg:py-28">
        <motion.div
          style={{ x: railX, willChange: "transform" }}
          className="mb-10 flex w-max gap-3 text-xs font-semibold text-slate-400"
          aria-hidden="true"
        >
          {Array.from({ length: 3 }).map((_, group) =>
            railItems.map((item) => (
              <span key={`${group}-${item}`} className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2">
                {item}
              </span>
            ))
          )}
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <motion.div style={{ y: titleY, willChange: "transform" }}>
            <p className="mb-5 text-sm font-semibold text-brand-200">01 / PORTFOLIO SIGNAL</p>
            <h2 className="break-words text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              THE
              <span className="block text-brand-200">FRONTEND</span>
              <span className="block text-slate-500">ERA</span>
            </h2>
          </motion.div>

          <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-panel md:p-6">
            <div className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-3">
              {["Build", "Polish", "Ship"].map((item, index) => (
                <div key={item} className="bg-slate-950/90 p-4">
                  <p className="text-xs text-slate-500">0{index + 1}</p>
                  <p className="mt-2 font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Welcome to a sharper portfolio flow: focused frontend craft, product-grade UI systems, and scroll-driven moments that frame the work before the details.
            </p>

            <a href="#about" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-200 transition hover:text-white">
              Continue
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3">
          {featureCards.map(({ icon: Icon, label, title, text }) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className="bg-slate-950/85 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <Icon className="h-5 w-5 text-brand-300" />
              </div>
              <h3 className="mt-8 text-2xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-500">
          <span>/AHMED PORTFOLIO</span>
          <span>SCROLL TO SEE THE WORK</span>
        </div>
      </div>
    </section>
  );
}
