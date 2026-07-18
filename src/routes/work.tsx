import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, RightRail, PageNumber } from "@/components/vmm/SideRail";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";
import ivo from "@/assets/vmm/real_ivo_vehicle.webp.asset.json";
import wise from "@/assets/vmm/real_wise_featured.webp.asset.json";
import ig from "@/assets/vmm/real_ig_sabroso.webp.asset.json";
import caballero from "@/assets/vmm/real_caballero.webp.asset.json";
import igConcept from "@/assets/vmm/card_ig_sabroso.png.asset.json";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Vence Michael Montero" },
      { name: "description", content: "Projects that deliver. Selected work across websites, web apps, mobile apps and branding." },
      { property: "og:title", content: "Work — Projects That Deliver" },
      { property: "og:description", content: "Selected projects across websites, apps, and digital products." },
    ],
  }),
  component: WorkPage,
});

type Cat = "WEBSITE" | "MOBILE APP" | "WEB APP" | "BRANDING";

type Row = {
  n: string;
  slug: string;
  category: Cat;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  tone: "dark" | "light";
};

const rows: Row[] = [
  {
    n: "01", slug: "ivo-cars", category: "WEBSITE",
    title: "IVO Cars — Smart EV Rental Website",
    subtitle: "A modern and responsive website for an electric vehicle rental service.",
    description: "A modern and responsive website for an electric vehicle rental service.",
    cover: ivo.url, tone: "dark",
  },
  {
    n: "02", slug: "wiseassistant", category: "MOBILE APP",
    title: "WiseAssistant — Offline Personal & Business Assistant",
    subtitle: "An offline-first assistant that helps you manage tasks, notes and reminders intelligently.",
    description: "An offline-first assistant that helps you manage tasks, notes and reminders intelligently.",
    cover: wise.url, tone: "light",
  },
  {
    n: "03", slug: "caballero-bikes", category: "WEBSITE",
    title: "Caballero Bikes — Motorcycle Marketplace Website",
    subtitle: "A bold marketplace for premium motorcycles with rich editorial photography.",
    description: "A bold marketplace for premium motorcycles with rich editorial photography.",
    cover: caballero.url, tone: "dark",
  },
  {
    n: "04", slug: "ig-sabroso", category: "WEBSITE",
    title: "IG Sabroso — Construction Company Website",
    subtitle: "A professional website showcasing services, projects and company expertise.",
    description: "A professional website showcasing services, projects and company expertise.",
    cover: ig.url, tone: "light",
  },
  {
    n: "05", slug: "ig-sabroso-concept", category: "BRANDING",
    title: "IG Sabroso — Design Concept Guide",
    subtitle: "A print-forward brand and design concept guide for the IG Sabroso identity system.",
    description: "A print-forward brand and design concept guide for the IG Sabroso identity system.",
    cover: igConcept.url, tone: "dark",
  },
];

const filters: Array<"ALL" | "WEBSITES" | "WEB APPS" | "BRANDING" | "MOBILE APPS" | "MORE"> = [
  "ALL", "WEBSITES", "WEB APPS", "BRANDING", "MOBILE APPS", "MORE",
];

function matches(cat: Cat, f: string): boolean {
  if (f === "ALL" || f === "MORE") return true;
  if (f === "WEBSITES") return cat === "WEBSITE";
  if (f === "WEB APPS") return cat === "WEB APP";
  if (f === "MOBILE APPS") return cat === "MOBILE APP";
  if (f === "BRANDING") return cat === "BRANDING";
  return true;
}

function WorkPage() {
  const [f, setF] = useState<(typeof filters)[number]>("ALL");
  const visible = useMemo(() => rows.filter((r) => matches(r.category, f)), [f]);

  useGsap(({ gsap }) => {
    gsap.from(".work-hero > *", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
    gsap.utils.toArray<HTMLElement>(".work-row").forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
  }, [visible.length]);

  return (
    <div className="relative">
      <Nav />
      <section className="relative w-full overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <Orbs
          items={[
            { size: "s", top: "12%", left: "16%", opacity: 0.4 },
            { size: "m", top: "6%", right: "10%", opacity: 0.35 },
            { size: "s", bottom: "30%", right: "18%", opacity: 0.3 },
            { size: "l", bottom: "-6%", right: "-8%", opacity: 0.2 },
          ]}
        />
        <LeftRail />
        <RightRail />

        <div className="mx-auto w-full max-w-[1520px] px-5 md:px-16 lg:px-24">
          <div className="work-hero max-w-3xl">
            <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">MY WORK</p>
            <h1 className="mt-4 font-display uppercase text-vmm-ink"
              style={{ fontSize: "clamp(44px, 6vw, 92px)", letterSpacing: "-0.02em", lineHeight: 0.9 }}>
              PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vmm-ink/80">
              I partner with businesses and brands to create digital solutions that are functional, aesthetic, and results-driven.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-vmm-line pb-4">
            {filters.map((label) => {
              const active = f === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setF(label)}
                  className={`relative pb-2 text-[12px] font-bold tracking-[0.22em] transition-colors ${active ? "text-vmm-red" : "text-vmm-ink hover:text-vmm-red"}`}
                >
                  {label}
                  {active && <span className="absolute inset-x-0 -bottom-[17px] h-[3px] bg-vmm-red" />}
                </button>
              );
            })}
          </div>

          {/* Project rows */}
          <ul className="mt-10 space-y-5 md:mt-12 md:space-y-6">
            {visible.map((r) => (
              <li key={r.slug} className="work-row">
                <ProjectRow row={r} />
              </li>
            ))}
          </ul>
        </div>

        <PageNumber n="003" />
      </section>

      <HomeFooter />
    </div>
  );
}

function ProjectRow({ row }: { row: Row }) {
  return (
    <Link
      to="/work/$slug"
      params={{ slug: row.slug }}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-vmm-line bg-white transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:grid-cols-[minmax(0,44%)_1fr_auto]"
    >
      {/* Cover */}
      <div className={`relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-[210px] ${row.tone === "dark" ? "bg-vmm-ink" : "bg-vmm-canvas"}`}>
        <img
          src={row.cover}
          alt={row.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-1 font-display text-lg text-white backdrop-blur-sm">
          {row.n}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <span className="text-[11px] font-bold tracking-[0.24em] text-vmm-red">{row.category}</span>
        <h3 className="font-display text-2xl leading-tight md:text-[26px]">{row.title}</h3>
        <p className="text-sm leading-relaxed text-vmm-ink/70">{row.subtitle}</p>
        <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-vmm-ink group-hover:text-vmm-red">
          VIEW PROJECT <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Red action tile */}
      <div className="hidden items-stretch md:flex">
        <span className="my-6 mr-6 grid w-16 place-items-center rounded-xl bg-vmm-red text-white transition-transform group-hover:-translate-y-1">
          <ArrowUpRight className="h-6 w-6" />
        </span>
      </div>
    </Link>
  );
}
