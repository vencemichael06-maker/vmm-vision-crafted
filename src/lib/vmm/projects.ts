// VMM Portfolio — proof-backed public project set.
// Source of truth: VMM_Portfolio_Pre_Implementation_Final_QA_Report.docx §3.

import thumbCaballeroD from "@/assets/vmm/proj/thumb-caballero-desktop.webp.asset.json";
import thumbCaballeroM from "@/assets/vmm/proj/thumb-caballero-mobile.webp.asset.json";
import thumbIgD from "@/assets/vmm/proj/thumb-ig-sabroso-desktop.webp.asset.json";
import thumbIgM from "@/assets/vmm/proj/thumb-ig-sabroso-mobile.webp.asset.json";
import thumbWaD from "@/assets/vmm/proj/thumb-wiseassistant-desktop.webp.asset.json";
import thumbWaM from "@/assets/vmm/proj/thumb-wiseassistant-mobile.webp.asset.json";
import thumbSheetD from "@/assets/vmm/proj/thumb-google-sheet-desktop.webp.asset.json";
import thumbSheetM from "@/assets/vmm/proj/thumb-google-sheet-mobile.webp.asset.json";
import thumbMbwosD from "@/assets/vmm/proj/thumb-mbwos-desktop.webp.asset.json";
import thumbMbwosM from "@/assets/vmm/proj/thumb-mbwos-mobile.webp.asset.json";

import heroCaballero from "@/assets/vmm/proj/hero-caballero.webp.asset.json";
import heroIg from "@/assets/vmm/proj/hero-ig-sabroso.webp.asset.json";
import heroSheet from "@/assets/vmm/proj/hero-google-sheet.webp.asset.json";
import heroMbwosExec from "@/assets/vmm/proj/hero-mbwos-exec.webp.asset.json";
import heroMbwosCust from "@/assets/vmm/proj/hero-mbwos-customers.webp.asset.json";
import heroMbwosAppr from "@/assets/vmm/proj/hero-mbwos-approvals.webp.asset.json";
import waDevice1 from "@/assets/vmm/proj/wa-device1.webp.asset.json";
import waDevice2 from "@/assets/vmm/proj/wa-device2.webp.asset.json";
import waDevice3 from "@/assets/vmm/proj/wa-device3.webp.asset.json";
import waDevice4 from "@/assets/vmm/proj/wa-device4.webp.asset.json";
import waDevice5 from "@/assets/vmm/proj/wa-device5.webp.asset.json";

export type ProjectCategory =
  | "Websites"
  | "Mobile Product"
  | "AI & Automation"
  | "Operations Systems";

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
    thumbnail: { desktop: thumbWaD.url, mobile: thumbWaM.url },
    cta: { kind: "case-study", label: "View case study" },
    summary:
      "WiseAssistant is an Android-first productivity companion that runs entirely on device — private, offline, in control. Focused UI, dashboards that separate personal and business workflows, and reminders / alarms without the cloud.",
    role: "Product design + Android",
    year: "2025–2026",
    stack: ["Kotlin", "Jetpack Compose", "Room", "AndroidX"],
    gallery: [
      { src: waDevice1.url, caption: "Splash — Private. Offline. In control." },
      { src: waDevice2.url, caption: "Personal dashboard" },
      { src: waDevice3.url, caption: "Business dashboard" },
      { src: waDevice4.url, caption: "Reminders & alarms" },
      { src: waDevice5.url, caption: "Device preview" },
    ],
  },
  {
    slug: "caballero-digital-solutions",
    index: "02",
    category: "Websites",
    title: "Caballero Digital Solutions",
    subtitle: "Agency website — brand, services, packages, project showcase.",
    status: "Completed",
    thumbnail: { desktop: thumbCaballeroD.url, mobile: thumbCaballeroM.url },
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
    gallery: [{ src: heroCaballero.url, caption: "Homepage hero and featured project" }],
  },
  {
    slug: "ig-sabroso-construction",
    index: "03",
    category: "Websites",
    title: "IG Sabroso Construction",
    subtitle: "Construction company website — services, projects, booking.",
    status: "Ongoing",
    statusNote: "Ongoing — 90% complete",
    thumbnail: { desktop: thumbIgD.url, mobile: thumbIgM.url },
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
    gallery: [{ src: heroIg.url, caption: "Homepage — hero with booking + stats" }],
  },
  {
    slug: "google-sheet-order-tracker",
    index: "04",
    category: "AI & Automation",
    title: "Google Sheet Order Tracker Automation",
    subtitle: "Live logistics dashboard powered by 17TRACK + Apps Script.",
    status: "Case Study",
    statusNote: "Sanitized case study — operational data withheld",
    thumbnail: { desktop: thumbSheetD.url, mobile: thumbSheetM.url },
    cta: { kind: "case-study", label: "View case study" },
    summary:
      "An automation that turns a plain Google Sheet into a live logistics dashboard: order intake, carrier tracking via the 17TRACK API, delayed-shipment detection, and an auto-refreshing status board. Owner-facing metrics only — customer records stay private.",
    role: "Automation design + Apps Script",
    year: "2026",
    stack: ["Google Sheets", "Apps Script", "17TRACK API"],
    gallery: [{ src: heroSheet.url, caption: "Owner dashboard — aggregate metrics" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const categoryFilters: ("All" | ProjectCategory)[] = [
  "All",
  "Websites",
  "Mobile Product",
  "AI & Automation",
  "Operations Systems",
];
