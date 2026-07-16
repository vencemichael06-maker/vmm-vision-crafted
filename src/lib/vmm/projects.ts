import ivoBooking from "@/assets/vmm/card_ivo_booking.png.asset.json";
import ivoFleet from "@/assets/vmm/card_ivo_fleet.png.asset.json";
import ivoVehicle from "@/assets/vmm/card_ivo_vehicle.png.asset.json";
import ivoPlans from "@/assets/vmm/card_ivo_plans.png.asset.json";
import wiseAlarm from "@/assets/vmm/card_wise_alarm.png.asset.json";
import igSabroso from "@/assets/vmm/card_ig_sabroso.png.asset.json";
import caballero from "@/assets/vmm/card_caballero.png.asset.json";

import realIvoBooking from "@/assets/vmm/real_ivo_booking.webp.asset.json";
import realIvoFleet from "@/assets/vmm/real_ivo_fleet.webp.asset.json";
import realIvoVehicle from "@/assets/vmm/real_ivo_vehicle.webp.asset.json";
import realIvoPlans from "@/assets/vmm/real_ivo_plans.webp.asset.json";
import realWiseFeatured from "@/assets/vmm/real_wise_featured.webp.asset.json";
import realWisePersonal from "@/assets/vmm/real_wise_personal.webp.asset.json";
import realWiseBusiness from "@/assets/vmm/real_wise_business.webp.asset.json";
import realWiseAlarm from "@/assets/vmm/real_wise_alarm.webp.asset.json";
import realWiseDevice from "@/assets/vmm/real_wise_device.webp.asset.json";
import realIgSabroso from "@/assets/vmm/real_ig_sabroso.webp.asset.json";
import realCaballero from "@/assets/vmm/real_caballero.webp.asset.json";

export type Project = {
  slug: string;
  index: string;
  category: "WEBSITE" | "MOBILE APP" | "WEB APP" | "BRANDING";
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  gallery: { src: string; caption: string }[];
  meta: { role: string; year: string; stack: string[] };
};

export const projects: Project[] = [
  {
    slug: "ivo-cars",
    index: "01",
    category: "WEBSITE",
    title: "IVO Cars — Smart EV Rental Website",
    subtitle: "A modern and responsive website for an electric vehicle rental service.",
    description:
      "IVO Cars needed a clean marketing and booking surface for its EV rental fleet. The site pairs an editorial hero with a fleet browser, a plans & FAQ section, and a streamlined booking flow — all wrapped in a black-forward visual language that lets the vehicles carry the color.",
    cover: ivoBooking.url,
    gallery: [
      { src: realIvoBooking.url, caption: "Booking flow — vehicle, dates, extras" },
      { src: realIvoFleet.url, caption: "Fleet grid" },
      { src: realIvoVehicle.url, caption: "Vehicle overview" },
      { src: realIvoPlans.url, caption: "Plans & FAQ" },
    ],
    meta: { role: "Design & Frontend", year: "2025", stack: ["Next.js", "TypeScript", "Tailwind", "GSAP"] },
  },
  {
    slug: "wiseassistant",
    index: "02",
    category: "MOBILE APP",
    title: "WiseAssistant — Offline Personal & Business Assistant",
    subtitle: "An offline-first assistant that helps you manage tasks, notes and reminders intelligently.",
    description:
      "WiseAssistant is an Android-first productivity companion that runs entirely on device. The app carries a dark, focused UI, a bold accent palette, and dashboards that separate personal life from business operations without switching apps.",
    cover: wiseAlarm.url,
    gallery: [
      { src: realWiseFeatured.url, caption: "Featured screens" },
      { src: realWisePersonal.url, caption: "Personal dashboard" },
      { src: realWiseBusiness.url, caption: "Business dashboard" },
      { src: realWiseAlarm.url, caption: "Alarm & reminders" },
      { src: realWiseDevice.url, caption: "On a real device" },
    ],
    meta: { role: "Product design + Android", year: "2025", stack: ["Kotlin", "Jetpack Compose", "Room"] },
  },
  {
    slug: "ig-sabroso",
    index: "03",
    category: "WEBSITE",
    title: "IG Sabroso — Construction Company Website",
    subtitle: "A professional website showcasing services, projects and company expertise.",
    description:
      "A confident marketing site for a mid-sized construction firm. Emphasis on real project photography, a services matrix, and a project inquiry flow — designed to look at home next to architectural portfolios.",
    cover: igSabroso.url,
    gallery: [{ src: realIgSabroso.url, caption: "Homepage & story" }],
    meta: { role: "Design & Frontend", year: "2024", stack: ["Astro", "TypeScript", "Tailwind"] },
  },
  {
    slug: "caballero-digital",
    index: "04",
    category: "WEBSITE",
    title: "Caballero Digital Solutions — Agency Website",
    subtitle: "A sleek and bold website for a digital agency focused on growth and technology.",
    description:
      "A statement site for a growth-and-tech agency. The palette leans deep black with red flourishes, echoing the VMM system. The layout uses oversized typography and a compact case-study grid.",
    cover: caballero.url,
    gallery: [{ src: realCaballero.url, caption: "Agency homepage" }],
    meta: { role: "Design & Frontend", year: "2024", stack: ["Next.js", "Tailwind", "Framer Motion"] },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
