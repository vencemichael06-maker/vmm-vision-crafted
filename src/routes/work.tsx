import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, RightRail, PageNumber } from "@/components/vmm/SideRail";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";


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

          {/* Empty state — ready for real project entries */}
          <div className="work-row mt-16 grid place-items-center rounded-xl border border-dashed border-vmm-ink/20 bg-white/40 px-6 py-24 text-center">
            <div className="max-w-lg">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-vmm-red/10 text-vmm-red">
                <span className="font-display text-lg">{f === "ALL" ? "00" : f.slice(0, 2)}</span>
              </div>
              <h2 className="mt-6 font-display text-3xl md:text-4xl">
                NEW WORK, LANDING SOON<span className="text-vmm-red">.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-vmm-ink/70 md:text-base">
                Real project case studies are being prepared for this space. Each entry will include an editorial cover,
                role, stack, and outcome — presented exactly as the approved production layout.
              </p>
            </div>
          </div>
        </div>

        <PageNumber n="003" />
      </section>



      <HomeFooter />
    </div>
  );
}
