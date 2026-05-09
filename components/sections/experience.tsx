"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { experiences } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionLabel icon="briefcase">Experience</SectionLabel>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
            Delivery experience across products, support, and training.
          </h2>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            A practical path through frontend engineering, client-facing software, and intensive cross-platform development.
          </p>
        </div>
        <div className="relative space-y-4 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-white/10 md:before:left-6">
          {experiences.map((item, i) => (
            <motion.article
              key={item.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="group relative ml-10 rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-panel transition hover:border-brand-300/40 hover:bg-white/[0.04] md:ml-16 md:p-6"
            >
              <span className="absolute -left-[2.1rem] top-6 h-3 w-3 rounded-full border border-brand-200 bg-brand-400 shadow-glow md:-left-[2.85rem]" />
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.role}</h3>
                  <p className="mt-1 text-brand-200">{item.company}</p>
                </div>
                <div className="text-left text-sm text-slate-400 md:text-right">
                  <p>{item.period}</p>
                  <p>{item.location}</p>
                </div>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-3">
                {item.points.map((point) => (
                  <li key={point} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
