export const profile = {
  name: "Ahmed Wael Alkaliby",
  shortName: "Ahmed Alkaliby",
  role: "Frontend Engineer",
  location: "Cairo, Egypt",
  email: "ahmedalkaliby@gmail.com",
  phone: "+20 111 634 7001",
  github: "https://github.com/ahmedwaelalkaliby",
  linkedin: "https://www.linkedin.com/in/ahmed-wael-al-kaliby-61b202212/",
  portfolio: "https://portfolio-ahmed-wael.vercel.app",
  summary:
    "Frontend Engineer focused on building high-performance, scalable, and interactive web experiences with React, Next.js, TypeScript, and modern UI systems.",
  intro:
    "I design, build, and ship clean product interfaces, dashboards, marketplaces, travel platforms, and motion-rich web experiences."
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

export const roles = [
  "React Engineer",
  "Next.js Specialist",
  "Frontend Developer",
  "UI Performance Builder"
];

export const stats = [
  { label: "Years Experience", value: "+2" },
  { label: "Main Stack", value: "Next.js" },
  { label: "Projects", value: "+7" },
  { label: "Location", value: "Egypt" }
];

export const experiences = [
  {
    company: "Taqnit AlM'alumat",
    role: "Front-End Developer",
    period: "Jan 2026 - Present",
    location: "Mansoura",
    points: [
      "Designed scalable frontend architecture using React.js and Next.js.",
      "Delivered responsive, pixel-perfect interfaces across devices and browsers.",
      "Improved performance, code quality, and integration with backend teams."
    ]
  },
  {
    company: "ReadzOil",
    role: "Software Support",
    period: "Jun 2025 - Dec 2025",
    location: "Remote",
    points: [
      "Supported clients in resolving application and technical issues.",
      "Contributed to improving software performance and usability."
    ]
  },
  {
    company: "Information Technology Institute (ITI)",
    role: "Front-end & Cross Platform Mobile Development Track",
    period: "Nov 2024 - May 2025",
    location: "Mansoura",
    points: [
      "Completed an intensive 6-month frontend and cross-platform training program.",
      "Built React, Next.js, React Native, and Socket.IO real-time features."
    ]
  },
  {
    company: "Jawda IT Solutions",
    role: "Front-End Developer",
    period: "Feb 2024 - Sep 2024",
    location: "Remote",
    points: [
      "Built interactive web apps with HTML, CSS, JavaScript, React.js, and Next.js.",
      "Enhanced UX, SEO, performance, and collaborated closely with designers."
    ]
  }
];

export const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "React Native",
  "Tailwind CSS",
  "Framer Motion",
  "Redux Toolkit",
  "Zustand",
  "Context API",
  "TanStack Query",
  "Axios",
  "React Hook Form",
  "Zod",
  "Next Auth",
  "Firebase",
  "Supabase",
  "Socket.IO",
  "Git",
  "GitHub"
];

export const projects = [
  {
    title: "Al-Mounafis",
    type: "Travel Agency System",
    description:
      "A complete travel platform with public package browsing, advanced filtering, i18n, authentication, and a full admin dashboard.",
    stack: ["Next.js", "TypeScript", "Next-Intl", "Redux Toolkit", "React Query", "Tailwind", "Framer Motion"]
  },
  {
    title: "Souq Shamel",
    type: "Marketplace Platform",
    description:
      "A high-performance multilingual marketplace built with modern state management, server-state caching, OAuth, and polished UI flows.",
    stack: ["Next.js", "TypeScript", "Zustand", "React Query", "Next-Intl", "OAuth", "Tailwind"]
  },
  {
    title: "Appointment System",
    type: "Doctor Booking App",
    description:
      "A find-and-book doctors application with reusable forms, validation, routing, server-state management, and responsive components.",
    stack: ["React.js", "Redux Toolkit", "React Query", "React Router", "Shadcn UI", "Tailwind"]
  },
  {
    title: "Hatly Website",
    type: "Landing Page",
    description:
      "A landing website for the Hatly mobile app with smooth motion, modern visual sections, and conversion-focused structure.",
    stack: ["Next.js", "Material UI", "Framer Motion", "React Icons"]
  },
  {
    title: "Merchen Store",
    type: "E-commerce Platform",
    description:
      "A responsive e-commerce experience featuring authentication, shopping flows, state management, and modern UI patterns.",
    stack: ["React.js", "Firebase", "Redux", "React Query", "Formik", "Yup", "Material UI"]
  }
];

export type ContactIcon = "mail" | "phone" | "mapPin" | "github" | "linkedin";

export const contactLinks: Array<{ label: string; href: string; icon: ContactIcon }> = [
  { label: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
  { label: profile.phone, href: `tel:${profile.phone}`, icon: "phone" },
  { label: profile.location, href: "#contact", icon: "mapPin" },
  { label: "GitHub", href: profile.github, icon: "github" },
  { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" }
];
