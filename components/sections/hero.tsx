"use client";

import { motion } from "framer-motion";
import { ArrowDown, CheckCircle2, Sparkles } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { profile, roles, stats } from "@/lib/data";

export const Hero = memo(function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % roles.length), 1700);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative z-10 flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex max-w-3xl flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-brand-300" />
            Available for high-impact frontend projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl"
          >
            Ahmed Wael
            <span className="block text-brand-200">Alkaliby</span>
          </motion.h1>

          <div className="mt-6 flex min-h-10 items-center justify-center overflow-hidden text-xl font-semibold text-brand-200 sm:text-2xl lg:justify-start">
            <motion.div
              key={roles[index]}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {roles[index]}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-5 max-w-2xl text-lg leading-8 text-slate-300"
          >
            {profile.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.65 }}
            className="mt-6 grid w-full max-w-2xl gap-3 text-sm text-slate-300 sm:grid-cols-3"
          >
            {["React systems", "Next.js products", "Motion interfaces"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-accent-mint" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <ButtonLink href="#projects" variant="secondary">View Projects</ButtonLink>
            <ButtonLink href={profile.github} variant="secondary">GitHub</ButtonLink>
          </motion.div>

          <a href="#about" className="mt-10 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowDown className="h-4 w-4" />
            Scroll
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="relative"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 shadow-panel backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs text-slate-500">CURRENT WORKSPACE</p>
                <p className="mt-1 text-sm font-semibold text-white">frontend-delivery.dashboard</p>
              </div>
              <span className="rounded-md border border-accent-mint/30 bg-accent-mint/10 px-2.5 py-1 text-xs text-accent-mint">online</span>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-[0.82fr_1.18fr]">
              <div className="bg-slate-950/90 p-5">
                <div className="flex h-28 items-end gap-2 border-b border-l border-white/10 px-2 pb-2">
                  {[42, 68, 54, 82, 64, 92].map((height, itemIndex) => (
                    <span
                      key={height}
                      className="w-full rounded-t-sm bg-brand-300/80"
                      style={{ height: `${height}%`, opacity: 0.45 + itemIndex * 0.08 }}
                    />
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  {["UX polish", "Data flows", "Performance"].map((item, itemIndex) => (
                    <div key={item} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{item}</span>
                      <span className={itemIndex === 1 ? "text-accent-amber" : "text-brand-200"}>{itemIndex === 0 ? "96%" : itemIndex === 1 ? "A" : "fast"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/90 p-5 font-mono text-sm leading-7 text-slate-300">
                <p><span className="text-brand-300">const</span> developer = &#123;</p>
                <p className="pl-5">name: <span className="text-brand-100">"Ahmed Wael"</span>,</p>
                <p className="pl-5">stack: [<span className="text-brand-100">"React"</span>, <span className="text-brand-100">"Next.js"</span>],</p>
                <p className="pl-5">focus: <span className="text-brand-100">"clean product UI"</span>,</p>
                <p className="pl-5">status: <span className="text-accent-mint">"ready"</span></p>
                <p>&#125;</p>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-r border-white/10 p-4 last:border-r-0">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
