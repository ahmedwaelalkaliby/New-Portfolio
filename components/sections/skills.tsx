"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";

const skillGroups = [
  {
    title: "Core",
    items: ["JavaScript", "TypeScript", "React.js", "Next.js", "React Native"]
  },
  {
    title: "Interface",
    items: ["Tailwind CSS", "Framer Motion", "Material UI", "Shadcn UI", "Responsive UI"]
  },
  {
    title: "State & Data",
    items: ["Redux Toolkit", "Zustand", "TanStack Query", "Axios", "Context API"]
  },
  {
    title: "Product Systems",
    items: ["React Hook Form", "Zod", "Next Auth", "Firebase", "Supabase", "Socket.IO"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="relative z-10 border-y border-white/10 bg-white/[0.02] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionLabel icon="layers">Skills</SectionLabel>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            A frontend stack built for shipped products.
          </h2>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Tools I use to build responsive interfaces, data-heavy screens, authentication flows, and interactive product surfaces.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2"
        >
          {skillGroups.map((group, groupIndex) => (
            <div key={group.title} className="bg-slate-950/80 p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-semibold text-white">{group.title}</h3>
                <span className={groupIndex % 2 === 0 ? "text-sm text-brand-300" : "text-sm text-accent-amber"}>
                  0{groupIndex + 1}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-all duration-200 hover:-translate-y-[3px] hover:border-brand-300/50 hover:text-brand-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
