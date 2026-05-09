"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

const accents = [
  "border-brand-300/30 bg-brand-300/10 text-brand-100",
  "border-accent-amber/30 bg-accent-amber/10 text-amber-100",
  "border-accent-mint/30 bg-accent-mint/10 text-emerald-100",
  "border-accent-rose/30 bg-accent-rose/10 text-rose-100"
];

export function Projects() {
  return (
    <section id="projects" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionLabel icon="sparkles">Projects</SectionLabel>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Selected work with modern frontend architecture.
          </h2>
          <p className="max-w-sm text-sm leading-7 text-slate-400">Data-driven product surfaces spanning travel systems, marketplaces, booking flows, landing pages, and e-commerce.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.07, duration: 0.65 }}
              whileHover={{ y: -6 }}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/75 shadow-panel transition hover:border-brand-300/35",
                i === 0 && "md:col-span-2"
              )}
            >
              <div className="grid min-h-full gap-px bg-white/10 md:grid-cols-[0.85fr_1.15fr]">
                <div className="flex min-h-56 flex-col justify-between bg-slate-950/80 p-6">
                  <div>
                    <span className={cn("inline-flex rounded-md border px-2.5 py-1 text-xs", accents[i % accents.length])}>
                      0{i + 1}
                    </span>
                    <h3 className="mt-5 text-3xl font-black leading-tight text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{project.type}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
                    <span>Case study</span>
                    <ExternalLink className="h-4 w-4 transition group-hover:text-brand-200" />
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-slate-950/80 p-6">
                  <p className="max-w-2xl leading-7 text-slate-300">{project.description}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
