import { Background } from "@/components/layout/background";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { IntroHeroGate } from "@/components/IntroHeroGate";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/sections/about").then((mod) => mod.About));
const Contact = dynamic(() => import("@/components/sections/contact").then((mod) => mod.Contact));
const Experience = dynamic(() => import("@/components/sections/experience").then((mod) => mod.Experience));
const LaunchScroll = dynamic(() => import("@/components/sections/launch-scroll").then((mod) => mod.LaunchScroll));
const Projects = dynamic(() => import("@/components/sections/projects").then((mod) => mod.Projects));
const Skills = dynamic(() => import("@/components/sections/skills").then((mod) => mod.Skills));

export default function Home() {
  return (
    <main className="min-h-screen bg-night text-white">
      <Background />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <IntroHeroGate />
      {/* Below fold: skip paint until near viewport */}
      <div className="cv-auto">
        <LaunchScroll />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
          &copy; 2026 Ahmed Wael Alkaliby. Built with Next.js, Tailwind CSS, and Framer Motion.
        </footer>
      </div>
    </main>
  );
}
