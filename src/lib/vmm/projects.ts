// Proof-backed portfolio content. This file is the only project-content source of truth.

const projectAssets = {
  wiseAssistant: "/assets/vmm/projects/wiseassistant-portfolio.webp",
  wiseDashboard: "/assets/vmm/projects/wiseassistant-dashboard.webp",
  wiseActivity: "/assets/vmm/projects/wiseassistant-activity.webp",
  wiseReminders: "/assets/vmm/projects/wiseassistant-reminders.webp",
  wiseAsk: "/assets/vmm/projects/wiseassistant-ask-wise.webp",
  caballero: "/assets/vmm/projects/caballero-digital-solutions-portfolio-v2.webp",
  igSabroso: "/assets/vmm/projects/ig-sabroso-portfolio-v2.webp",
  orderTracker: "/assets/vmm/projects/google-sheet-order-tracker-portfolio.webp",
  gmailSupport: "/assets/vmm/projects/gmail-support-agent.webp",
  gmailResponse: "/assets/vmm/projects/gmail-support-response.webp",
  triggerEmail: "/assets/vmm/projects/trigger-email-automation.webp",
  voiceAi: "/assets/vmm/projects/voice-ai-agent.webp",
} as const;

export type ProjectCategory = "Websites" | "Mobile Product" | "AI & Automation";
export type ProjectStatus = "Completed" | "Ongoing" | "Beta" | "Delivered" | "Confidential";

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
  client?: string;
  delivered?: string;
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
    gallery: [
      { src: projectAssets.wiseAssistant, caption: "Android product interface preview" },
      { src: projectAssets.wiseDashboard, caption: "Personal finance dashboard" },
      { src: projectAssets.wiseActivity, caption: "Transaction activity and search" },
      { src: projectAssets.wiseReminders, caption: "Bills and reminders overview" },
      { src: projectAssets.wiseAsk, caption: "On-device Ask Wise assistant" },
    ],
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
    slug: "google-sheets-order-tracker",
    index: "04",
    category: "AI & Automation",
    title: "Google Sheets Order Tracker Automation",
    subtitle: "Automated order tracking and logistics reporting for HeldHonest.com.",
    status: "Delivered",
    thumbnail: { desktop: projectAssets.orderTracker, mobile: projectAssets.orderTracker },
    cta: { kind: "case-study", label: "View project" },
    summary:
      "Developed an automated order-tracking and logistics system with status monitoring, delayed-order detection, exception visibility, and structured operational reporting.",
    role: "Automation design + Apps Script",
    year: "2025",
    client: "HeldHonest.com",
    delivered: "Nov 7, 2025",
    stack: ["Google Sheets", "Apps Script"],
    gallery: [{ src: projectAssets.orderTracker, caption: "Privacy-safe logistics workflow" }],
  },
  {
    slug: "gmail-customer-support-ai-agent",
    index: "05",
    category: "AI & Automation",
    title: "24/7 Gmail Customer Support AI Agent",
    subtitle: "Knowledge-based Gmail support workflow for HeldHonest.com.",
    status: "Delivered",
    thumbnail: { desktop: projectAssets.gmailSupport, mobile: projectAssets.gmailSupport },
    cta: { kind: "case-study", label: "View project" },
    summary:
      "Built a knowledge-based customer support workflow for continuous Gmail inquiry handling, response consistency, context-aware routing, and human escalation when required.",
    role: "Automation design + implementation",
    year: "2025",
    client: "HeldHonest.com",
    delivered: "Nov 7, 2025",
    stack: ["n8n", "Gmail", "Knowledge Base"],
    gallery: [
      { src: projectAssets.gmailSupport, caption: "Customer support automation overview" },
      {
        src: projectAssets.gmailResponse,
        caption: "Inquiry and knowledge-based response evidence",
      },
    ],
  },
  {
    slug: "trigger-based-email-marketing",
    index: "06",
    category: "AI & Automation",
    title: "Trigger-Based Outbound Email Marketing & Customer Service",
    subtitle: "Lifecycle email automation for HelloBloomKids.com.",
    status: "Delivered",
    thumbnail: { desktop: projectAssets.triggerEmail, mobile: projectAssets.triggerEmail },
    cta: { kind: "case-study", label: "View project" },
    summary:
      "Implemented trigger-based outbound marketing and customer-service workflows for personalized follow-ups, response handling, and lifecycle-based customer communication.",
    role: "Automation design + implementation",
    year: "2026",
    client: "HelloBloomKids.com",
    delivered: "Jan 9, 2026",
    stack: ["n8n", "Email Automation"],
    gallery: [{ src: projectAssets.triggerEmail, caption: "Email automation project summary" }],
  },
  {
    slug: "voice-ai-agent",
    index: "07",
    category: "AI & Automation",
    title: "Voice AI Agent",
    subtitle: "Appointment-booking voice workflow with calendar actions.",
    status: "Confidential",
    thumbnail: { desktop: projectAssets.voiceAi, mobile: projectAssets.voiceAi },
    cta: { kind: "case-study", label: "View project" },
    summary:
      "A voice-request workflow that coordinates helper and calendar agents to retrieve, book, update, or cancel appointments before returning a relevant response.",
    role: "Voice automation design + implementation",
    year: "Confidential",
    stack: ["Webhook", "OpenAI", "Google Calendar"],
    gallery: [{ src: projectAssets.voiceAi, caption: "Appointment-booking voice agent workflow" }],
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
