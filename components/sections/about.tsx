import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { profile } from "@/lib/data";

const highlights = [
  "Scalable frontend architecture",
  "Responsive product interfaces",
  "Server-state & form systems",
  "Motion-rich user experiences"
];

export function About() {
  return (
    <section id="about" className="relative z-10 border-y border-white/10 bg-white/[0.02] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionLabel icon="code">About</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Building product interfaces that stay fast under real use.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
              I work closest to the places where design, frontend architecture, and product quality meet.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="text-slate-300">
            <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              <div className="bg-slate-950/80 p-6 sm:col-span-2">
                <p className="leading-8">{profile.intro}</p>
                <p className="mt-4 leading-8">
                  I work with React.js, Next.js, React Native, TypeScript, real-time features, API integration, authentication, and performance-focused UI development.
                </p>
              </div>
              {highlights.map((item, index) => (
                <div key={item} className="bg-slate-950/80 p-5">
                  <span className="text-sm text-brand-300">0{index + 1}</span>
                  <p className="mt-3 font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
