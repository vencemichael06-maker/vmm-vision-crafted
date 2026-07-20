import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";

type Cat = "WEBSITE" | "MOBILE APP" | "WEB APP" | "BRANDING";
type Row = { n: string; slug: string; category: Cat; title: string; subtitle: string; cover: string; tone: "dark" | "light" };

const rows: Row[] = [
  {
    n: "01", slug: "ivo-cars", category: "WEBSITE",
    title: "IVO Cars — Smart EV Rental Website",
    subtitle: "A modern and responsive website for an electric vehicle rental service.",
    cover: "/assets/vmm/projects/ivo-cars.webp", tone: "dark",
  },
  {
    n: "02", slug: "wiseassistant", category: "MOBILE APP",
    title: "WiseAssistant — Offline Personal & Business Assistant",
    subtitle: "An offline-first assistant that helps you manage tasks, notes, and reminders intelligently.",
    cover: "/assets/vmm/projects/wiseassistant.webp", tone: "dark",
  },
  {
    n: "03", slug: "ig-sabroso", category: "WEBSITE",
    title: "IG Sabroso — Construction Company Website",
    subtitle: "A professional website showcasing services, projects, and company expertise.",
    cover: "/assets/vmm/projects/ig-sabroso.webp", tone: "dark",
  },
  {
    n: "04", slug: "caballero-digital-solutions", category: "WEBSITE",
    title: "Caballero Digital Solutions — Agency Website",
    subtitle: "A sleek and bold website for a digital agency focused on growth and technology.",
    cover: "/assets/vmm/projects/caballero-digital-solutions.webp", tone: "dark",
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
    <section id="work" aria-label="Selected work" className="relative w-full overflow-hidden py-16 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <Orbs items={[
        { size: "s", top: "8%", left: "16%", opacity: 0.35 },
        { size: "m", top: "4%", right: "10%", opacity: 0.3 },
        { size: "l", bottom: "-6%", right: "-8%", opacity: 0.18 },
      ]} />

      <div className="mx-auto w-full max-w-[1520px] px-5 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">MY WORK</p>
          <h2 className="mt-4 font-display uppercase text-vmm-ink"
            style={{ fontSize: "clamp(44px, 6vw, 92px)", letterSpacing: "-0.02em", lineHeight: 0.9 }}>
            PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-vmm-ink/80">
            I partner with businesses and brands to create digital solutions that are functional, aesthetic, and results-driven.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-vmm-line pb-4">
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
