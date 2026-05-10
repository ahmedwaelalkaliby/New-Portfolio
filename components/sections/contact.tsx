import type { SVGProps } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactLinks, type ContactIcon, profile } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";

const Github = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const Linkedin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function ContactIcon({ type }: { type: ContactIcon }) {
  const className = "h-5 w-5 text-brand-300";

  switch (type) {
    case "mail":
      return <Mail className={className} />;
    case "phone":
      return <Phone className={className} />;
    case "mapPin":
      return <MapPin className={className} />;
    case "github":
      return <Github className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
  }
}

export function Contact() {
  return (
    <section id="contact" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 shadow-panel">
        <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_0.82fr]">
          <div className="bg-slate-950/90 p-6 md:p-10">
            <SectionHeader />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${profile.email}`} variant="secondary">Contact Me</ButtonLink>
              <ButtonLink href={profile.linkedin} variant="secondary">LinkedIn</ButtonLink>
            </div>
          </div>
          <div className="bg-slate-950/90 p-4 md:p-6">
            <div className="grid gap-2">
              {contactLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.03] p-4 text-slate-200 transition hover:border-brand-300/40 hover:bg-brand-400/10"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <ContactIcon type={icon} />
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="text-xs text-slate-500">Open</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <>
      <p className="mb-4 text-sm font-semibold text-brand-200">CONTACT</p>
      <h2 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">Let&apos;s build something sharp.</h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
        Open to frontend roles, product teams, and freelance projects focused on React, Next.js, dashboards, SaaS interfaces, marketplaces, and interactive websites.
      </p>
    </>
  );
}
