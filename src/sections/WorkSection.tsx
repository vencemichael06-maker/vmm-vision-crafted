import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import ivoCover from "@/assets/vmm/real_ivo_vehicle.webp.asset.json";
import wiseCover from "@/assets/vmm/real_wise_featured.webp.asset.json";
import sabrosoCover from "@/assets/vmm/real_ig_sabroso.webp.asset.json";
import caballeroCover from "@/assets/vmm/real_caballero.webp.asset.json";

type Cat = "WEBSITE" | "MOBILE APP" | "WEB APP" | "BRANDING";
type Row = {
  n: string;
  slug: string;
  category: Cat;
  title: string;
  shortTitle: string;
  subtitle: string;
  cover: string;
  tone: "dark" | "light";
  featured?: boolean;
};

const rows: Row[] = [
  {
    n: "01", slug: "ivo-cars", category: "WEBSITE",
    title: "IVO Cars — Smart EV Rental Website",
    shortTitle: "IVO CARS",
    subtitle: "Smart EV Rental Website",
    cover: ivoCover.url, tone: "dark", featured: true,
  },
  {
    n: "02", slug: "wiseassistant", category: "MOBILE APP",
    title: "WiseAssistant — Offline Personal & Business Assistant",
    shortTitle: "WISEASSISTANT",
    subtitle: "Offline Personal & Business Assistant",
    cover: wiseCover.url, tone: "light",
  },
  {
    n: "03", slug: "caballero-digital-solutions", category: "WEBSITE",
    title: "Caballero Digital Solutions — Agency Website",
    shortTitle: "CABALLERO DIGITAL",
    subtitle: "Digital Solutions Agency Website",
    cover: caballeroCover.url, tone: "dark",
  },
  {
    n: "04", slug: "ig-sabroso", category: "WEBSITE",
    title: "IG Sabroso — Construction Company Website",
    shortTitle: "IG SABROSO",
    subtitle: "Construction Company Website",
    cover: sabrosoCover.url, tone: "dark",
  },
];

const filters = ["ALL", "WEBSITES", "WEB APPS", "BRANDING", "MOBILE APPS", "MORE"] as const;

function matches(cat: Cat, f: string): boolean {
  if (f === "ALL" || f === "MORE") return true;
  if (f === "WEBSITES") return cat === "WEBSITE";
  if (f === "WEB APPS") return cat === "WEB APP";
  if (f === "MOBILE APPS") return cat === "MOBILE APP";
  if (f === "BRANDING") return cat === "BRANDING";
  return true;
}

export function WorkSection() {
  const [f, setF] = useState<(typeof filters)[number]>("ALL");
  const visible = useMemo(() => rows.filter((r) => matches(r.category, f)), [f]);

  useGsap(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>(".work-row").forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
  }, [visible.length]);

  return (
    <section id="work" aria-label="Selected work" className="relative w-full overflow-hidden py-20 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <Orbs items={[
        { size: "s", top: "8%", left: "16%", opacity: 0.35 },
        { size: "m", top: "4%", right: "10%", opacity: 0.3 },
        { size: "l", bottom: "-6%", right: "-8%", opacity: 0.18 },
      ]} />

      <div className="mx-auto w-full max-w-[1520px] px-5 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <p className="text-[12px] font-bold tracking-[0.32em] text-vmm-red md:text-[13px] md:tracking-[0.28em]">MY WORK</p>
          <h2 className="mt-3 font-display uppercase text-vmm-ink md:mt-4"
            style={{ fontSize: "clamp(40px, 6vw, 92px)", letterSpacing: "-0.02em", lineHeight: 0.9 }}>
            PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[14px] leading-[1.55] text-vmm-ink/75 md:mt-6 md:text-base md:leading-relaxed">
            I partner with businesses and brands to create digital solutions that are functional, aesthetic, and results-driven.
          </p>
        </div>

        {/* Mobile: single VIEW ALL PROJECTS pill instead of filter tabs */}
        <div className="mt-7 md:hidden">
          <a
            href="#work"
            className="inline-flex min-h-[48px] items-center gap-6 bg-vmm-ink px-6 text-[11.5px] font-bold tracking-[0.24em] text-white"
          >
            VIEW ALL PROJECTS <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Desktop: filter tabs */}
        <div className="mt-12 hidden flex-wrap items-center gap-x-8 gap-y-3 border-b border-vmm-line pb-4 md:flex">
          {filters.map((label) => {
            const active = f === label;
            return (
              <button key={label} type="button" onClick={() => setF(label)}
                className={`relative pb-2 text-[12px] font-bold tracking-[0.22em] transition-colors ${active ? "text-vmm-red" : "text-vmm-ink hover:text-vmm-red"}`}>
                {label}
                {active && <span className="absolute inset-x-0 -bottom-[17px] h-[3px] bg-vmm-red" />}
              </button>
            );
          })}
        </div>

        {/* Mobile stacked cards */}
        <ul className="mt-8 space-y-4 md:hidden">
          {rows.map((r) => (
            <li key={r.slug} className="work-row">
              <MobileProjectCard row={r} />
            </li>
          ))}
        </ul>

        {/* Desktop rows */}
        <ul className="mt-10 hidden space-y-5 md:mt-12 md:block md:space-y-6">
          {visible.map((r) => (
            <li key={r.slug} className="work-row">
              <ProjectRow row={r} />
            </li>
          ))}
        </ul>
      </div>

      <PageNumber n="003" />
    </section>
  );
}

function MobileProjectCard({ row }: { row: Row }) {
  const isLight = row.tone === "light";
  const isFeatured = !!row.featured;
  return (
    <article
      aria-label={row.title}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[14px] ${
        isLight ? "bg-white ring-1 ring-vmm-line" : "bg-vmm-ink text-white"
      }`}
    >
      {/* Media */}
      <div
        className={`relative w-full overflow-hidden ${
          isFeatured ? "aspect-[16/10]" : "aspect-[16/9]"
        } ${isLight ? "bg-vmm-canvas" : "bg-vmm-ink"}`}
      >
        <img
          src={row.cover}
          alt={row.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {isFeatured && (
          <span className="absolute left-3 top-3 rounded-sm bg-vmm-red px-2.5 py-1 text-[9.5px] font-bold tracking-[0.24em] text-white">
            FEATURED PROJECT
          </span>
        )}
      </div>

      {/* Caption */}
      <div className={`flex items-start justify-between gap-4 px-4 pb-4 pt-3 ${isLight ? "text-vmm-ink" : "text-white"}`}>
        <div className="min-w-0">
          <h3
            className="font-display uppercase leading-[1]"
            style={{ fontSize: isFeatured ? "20px" : "17px", letterSpacing: "-0.01em" }}
          >
            {row.shortTitle}
          </h3>
          <p
            className={`mt-1.5 truncate text-[11.5px] ${
              isLight ? "text-vmm-ink/70" : "text-white/70"
            }`}
          >
            {row.subtitle}
          </p>
        </div>
        <ArrowRight
          className="mt-1 h-4 w-4 shrink-0 text-vmm-red"
          aria-hidden
        />
      </div>
    </article>
  );
}

function ProjectRow({ row }: { row: Row }) {
  return (
    <article
      aria-label={row.title}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-vmm-line bg-white transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:grid-cols-[minmax(0,44%)_1fr_auto]"
    >
      <div className={`relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-[210px] ${row.tone === "dark" ? "bg-vmm-ink" : "bg-vmm-canvas"}`}>
        <img src={row.cover} alt={row.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
        <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-1 font-display text-lg text-white backdrop-blur-sm">{row.n}</div>
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <span className="text-[11px] font-bold tracking-[0.24em] text-vmm-red">{row.category}</span>
        <h3 className="font-display text-2xl leading-tight md:text-[26px]">{row.title}</h3>
        <p className="text-sm leading-relaxed text-vmm-ink/70">{row.subtitle}</p>
        <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-vmm-ink">
          VIEW PROJECT <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="hidden items-stretch md:flex">
        <span className="my-6 mr-6 grid w-16 place-items-center rounded-xl bg-vmm-red text-white">
          <ArrowUpRight className="h-6 w-6" />
        </span>
      </div>
    </article>
  );
}
