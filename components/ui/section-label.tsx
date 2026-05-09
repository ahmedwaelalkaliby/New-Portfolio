"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Code2,
  Layers3,
  Sparkles,
  type LucideIcon
} from "lucide-react";

type SectionIcon = "briefcase" | "code" | "layers" | "sparkles";

const icons: Record<SectionIcon, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  code: Code2,
  layers: Layers3,
  sparkles: Sparkles
};

interface SectionLabelProps {
  icon: SectionIcon;
  children: React.ReactNode;
}

export function SectionLabel({ icon, children }: SectionLabelProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-brand-100"
    >
      <Icon className="h-4 w-4" />
      {children}
    </motion.div>
  );
}
