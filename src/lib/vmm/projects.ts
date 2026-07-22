// Proof-backed portfolio content. This file is the only project-content source of truth.

const projectAssets = {
  wiseAssistant: "/assets/vmm/projects/wiseassistant-portfolio.webp",
  caballero: "/assets/vmm/projects/caballero-digital-solutions-portfolio.webp",
  igSabroso: "/assets/vmm/projects/ig-sabroso-portfolio.webp",
  orderTracker: "/assets/vmm/projects/google-sheet-order-tracker-portfolio.webp",
} as const;

export type ProjectCategory = "Websites" | "Mobile Product" | "AI & Automation";
export type ProjectStatus = "Completed" | "Ongoing" | "Case Study" | "Beta";

export type ProjectCta =
  | { kind: "external"; href: string; label: string }
  | { kind: "case-study"; label: string }
  | { kind: "disabled"; label: string; reason: string };

export type Project = {
  slug: string;
  index: string;
  category: ProjectCategory;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  statusNote?: string;
  thumbnail: { desktop: string; mobile: string };
  cta: ProjectCta;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  gallery: { src: string; caption: string }[];
};

export const projects: Project[] = [
  {
    slug: "wiseassistant",
    index: "01",
    category: "Mobile Product",
    title: "WiseAssistant",
    subtitle: "Offline-first personal & business assistant for Android.",
    status: "Beta",
    statusNote: "Android Beta v1.1.0 — debug-signed preview build",
    thumbnail: { desktop: projectAssets.wiseAssistant, mobile: projectAssets.wiseAssistant },
    cta: { kind: "case-study", label: "View case study" },
    summary:
      "WiseAssistant is an Android-first productivity companion that runs entirely on device — private, offline, in control. Focused UI, dashboards that separate personal and business workflows, and reminders / alarms without the cloud.",
    role: "Product design + Android",
    year: "2025–2026",
    stack: ["Kotlin", "Jetpack Compose", "Room", "AndroidX"],
    gallery: [{ src: projectAssets.wiseAssistant, caption: "Android product interface preview" }],
  },
  {
    slug: "caballero-digital-solutions",
    index: "02",
    category: "Websites",
    title: "Caballero Digital Solutions",
    subtitle: "Agency website — brand, services, packages, project showcase.",
    status: "Completed",
    thumbnail: { desktop: projectAssets.caballero, mobile: projectAssets.caballero },
    cta: {
      kind: "external",
      href: "https://caballerodigitalsolutions.com",
      label: "Visit project",
    },
    summary:
      "A bold agency website for Caballero Digital Solutions: dark editorial hero, services matrix, packages, featured project carousel, and a book-a-consultation flow. Built for growing businesses who need a professional online presence.",
    role: "Design & Frontend",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    gallery: [{ src: projectAssets.caballero, caption: "Homepage and project presentation" }],
  },
  {
    slug: "ig-sabroso-construction",
    index: "03",
    category: "Websites",
    title: "IG Sabroso Construction",
    subtitle: "Construction company website — services, projects, booking.",
    status: "Ongoing",
    statusNote: "Ongoing — 90% complete",
    thumbnail: { desktop: projectAssets.igSabroso, mobile: projectAssets.igSabroso },
    cta: {
      kind: "external",
      href: "https://www.igsabroso.com",
      label: "View project",
    },
    summary:
      "A confident marketing site for a mid-sized construction firm: services, projects, a real appointment/booking flow, and clear proof points (10+ years, 300+ projects). Currently 90% complete and in active refinement.",
    role: "Design & Frontend",
    year: "2025",
    stack: ["Astro", "TypeScript", "Tailwind"],
    gallery: [{ src: projectAssets.igSabroso, caption: "Construction website preview" }],
  },
  {
    slug: "google-sheet-order-tracker",
    index: "04",
    category: "AI & Automation",
    title: "Google Sheet Order Tracker Automation",
    subtitle: "Live logistics dashboard powered by 17TRACK + Apps Script.",
    status: "Case Study",
    statusNote: "Sanitized case study — operational data withheld",
    thumbnail: { desktop: projectAssets.orderTracker, mobile: projectAssets.orderTracker },
    cta: { kind: "case-study", label: "View case study" },
    summary:
      "An automation that turns a plain Google Sheet into a live logistics dashboard: order intake, carrier tracking via the 17TRACK API, delayed-shipment detection, and an auto-refreshing status board. Owner-facing metrics only — customer records stay private.",
    role: "Automation design + Apps Script",
    year: "2026",
    stack: ["Google Sheets", "Apps Script", "17TRACK API"],
    gallery: [{ src: projectAssets.orderTracker, caption: "Sanitized logistics workflow" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const categoryFilters: ("All" | ProjectCategory)[] = [
  "All",
  "Websites",
  "Mobile Product",
  "AI & Automation",
];
