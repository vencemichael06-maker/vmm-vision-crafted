import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, RightRail, PageNumber } from "@/components/vmm/SideRail";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";
import { projects } from "@/lib/vmm/projects";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Vence Michael Montero" },
      { name: "description", content: "Selected work: websites, web apps, mobile apps and branding. Projects that deliver." },
      { property: "og:title", content: "Work — Projects that deliver" },
      { property: "og:description", content: "Selected projects across websites, apps, and digital products." },
    ],
  }),
  component: WorkPage,
});

const filters = ["ALL", "WEBSITES", "WEB APPS", "BRANDING", "MOBILE APPS", "MORE"] as const;

function WorkPage() {
  const [f, setF] = useState<(typeof filters)[number]>("ALL");

  useGsap(({ gsap }) => {
    gsap.from(".work-hero > *", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
    gsap.utils.toArray<HTMLElement>(".work-row").forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  }, []);

  const visible = projects.filter((p) => {
    if (f === "ALL") return true;
    if (f === "WEBSITES") return p.category === "WEBSITE";
    if (f === "WEB APPS") return p.category === "WEB APP";
    if (f === "MOBILE APPS") return p.category === "MOBILE APP";
    if (f === "BRANDING") return p.category === "BRANDING";
    return true;
  });

  return (
    <div className="relative">
      <Nav />
      <section className="relative w-full overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24">
        <Orbs
          items={[
            { size: "s", top: "10%", left: "12%", opacity: 0.4 },
            { size: "m", top: "8%", right: "6%", opacity: 0.4 },
            { size: "s", bottom: "30%", right: "18%", opacity: 0.35 },
            { size: "l", bottom: "0%", right: "-6%", opacity: 0.25 },
          ]}
        />
        <LeftRail />
        <RightRail />

        <div className="mx-auto w-full max-w-[1760px] px-5 md:px-16 lg:px-24">
          <div className="work-hero max-w-3xl">
            <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">MY WORK</p>
            <h1 className="mt-4 font-display text-6xl md:text-8xl">
              PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vmm-ink/80 md:text-lg">
              I partner with businesses and brands to create digital solutions that are functional, aesthetic, and results-driven.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-vmm-line pb-4">
            {filters.map((label) => {
              const active = f === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setF(label)}
                  className={`relative pb-2 text-[13px] font-bold tracking-[0.2em] transition-colors ${active ? "text-vmm-red" : "text-vmm-ink hover:text-vmm-red"}`}
                >
                  {label}
                  {active && <span className="absolute inset-x-0 -bottom-[17px] h-[3px] bg-vmm-red" />}
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-6">
            {visible.map((p) => (
              <Link
                key={p.slug}
                to="/work/$slug"
                params={{ slug: p.slug }}
                className="work-row group grid grid-cols-1 items-stretch overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 md:grid-cols-[320px_1fr_88px] lg:grid-cols-[420px_1fr_120px]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-vmm-ink md:aspect-auto">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-3 font-display text-2xl text-white/95">{p.index}</span>
                </div>
                <div className="flex flex-col justify-center gap-2 p-6 md:p-8">
                  <p className="text-[11px] font-bold tracking-[0.24em] text-vmm-red">{p.category}</p>
                  <h3 className="font-display text-xl md:text-2xl">{p.title}</h3>
                  <p className="max-w-2xl text-sm text-vmm-ink/70 md:text-base">{p.subtitle}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] group-hover:text-vmm-red">
                    VIEW PROJECT
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
                <div className="hidden shrink-0 items-center justify-center bg-vmm-red text-white md:flex">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <PageNumber n="003" />
      </section>

      <HomeFooter />
    </div>
  );
}
