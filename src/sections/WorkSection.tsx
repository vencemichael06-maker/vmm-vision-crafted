import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import {
  projects,
  categoryFilters,
  type Project,
  type ProjectCategory,
} from "@/lib/vmm/projects";

export function WorkSection() {
  const [filter, setFilter] = useState<(typeof categoryFilters)[number]>("All");
  const visible = useMemo<Project[]>(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  useGsap(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>(".work-row").forEach((el) => {
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  }, [visible.length]);

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative w-full overflow-hidden py-16 md:py-32"
      style={{ scrollMarginTop: "80px" }}
    >
      <Orbs
        items={[
          { size: "s", top: "8%", left: "16%", opacity: 0.35 },
          { size: "m", top: "4%", right: "10%", opacity: 0.3 },
          { size: "l", bottom: "-6%", right: "-8%", opacity: 0.18 },
        ]}
      />

      <div className="mx-auto w-full max-w-[1520px] px-5 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">MY WORK</p>
          <h2
            className="mt-4 font-display uppercase text-vmm-ink"
            style={{
              fontSize: "clamp(44px, 6vw, 92px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
            }}
          >
            PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-vmm-ink/80">
            Five proof-backed projects — websites shipped for real clients, a mobile product in
            beta, and internal systems documented as sanitized case studies.
          </p>
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-vmm-line pb-4"
        >
          {categoryFilters.map((label) => {
            const active = filter === label;
            const count =
              label === "All"
                ? projects.length
                : projects.filter((p) => p.category === (label as ProjectCategory)).length;
            return (
              <button
                key={label}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(label)}
                className={`relative pb-2 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors ${
                  active ? "text-vmm-red" : "text-vmm-ink hover:text-vmm-red"
                }`}
              >
                {label} <span className="ml-1 text-[10px] font-semibold text-vmm-ink/50">({count})</span>
                {active && <span className="absolute inset-x-0 -bottom-[17px] h-[3px] bg-vmm-red" />}
              </button>
            );
          })}
        </div>

        <ul className="mt-10 space-y-6 md:mt-12">
          {visible.map((p) => (
            <li key={p.slug} className="work-row">
              <ProjectRow project={p} />
            </li>
          ))}
          {visible.length === 0 && (
            <li className="py-16 text-center text-sm text-vmm-ink/60">
              No projects in this category yet.
            </li>
          )}
        </ul>
      </div>

      <PageNumber n="003" />
    </section>
  );
}

function StatusPill({ status, note }: { status: Project["status"]; note?: string }) {
  const tone: Record<Project["status"], string> = {
    Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    Ongoing: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    "Case Study": "bg-vmm-ink/5 text-vmm-ink border-vmm-line",
    Beta: "bg-vmm-red/10 text-vmm-red border-vmm-red/30",
  };
  return (
    <span
      title={note}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase ${tone[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ProjectRow({ project: p }: { project: Project }) {
  return (
    <article
      aria-label={p.title}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-vmm-line bg-white transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:grid-cols-[minmax(0,44%)_1fr]"
    >
      {/* Media wrapper — fixed aspect, object-contain, paper background. */}
      <div className="relative w-full overflow-hidden bg-vmm-canvas">
        <div className="aspect-[4/3] w-full md:aspect-[16/10]">
          <picture>
            <source media="(min-width: 768px)" srcSet={p.thumbnail.desktop} />
            <img
              src={p.thumbnail.mobile}
              alt={`${p.title} — project preview`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02] md:p-4"
            />
          </picture>
        </div>
        <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-vmm-ink/85 px-3 py-1 font-display text-lg text-white backdrop-blur-sm">
          {p.index}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-3 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-vmm-red">
            {p.category}
          </span>
          <StatusPill status={p.status} note={p.statusNote} />
        </div>
        <h3 className="font-display text-2xl leading-tight md:text-[26px]">{p.title}</h3>
        <p className="text-sm leading-relaxed text-vmm-ink/70">{p.subtitle}</p>
        {p.statusNote && (
          <p className="text-[11px] font-medium tracking-[0.02em] text-vmm-ink/50">
            {p.statusNote}
          </p>
        )}

        <ProjectCtaButton project={p} />
      </div>
    </article>
  );
}

function ProjectCtaButton({ project: p }: { project: Project }) {
  const base =
    "mt-2 inline-flex w-fit items-center gap-2 rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-transform";

  if (p.cta.kind === "external") {
    return (
      <a
        href={p.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-vmm-ink text-white hover:-translate-y-0.5`}
      >
        {p.cta.label} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }
  return (
    <Link
      to="/work/$slug"
      params={{ slug: p.slug }}
      className={`${base} border border-vmm-ink text-vmm-ink hover:border-vmm-red hover:text-vmm-red`}
    >
      {p.cta.label} <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}
