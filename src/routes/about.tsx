import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { CalendarDays, Users, FolderCheck } from "lucide-react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, PageNumber } from "@/components/vmm/SideRail";
import { HomeToolsStrip, HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";
import hand from "@/assets/vmm/about_hand.png.asset.json";
import handHl from "@/assets/vmm/about_hand_highlight.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vence Michael Montero" },
      { name: "description", content: "I design. I build. I solve. UI/UX Designer and Frontend Developer turning ideas into intuitive, functional and visually stunning products." },
      { property: "og:title", content: "About — Vence Michael Montero" },
      { property: "og:description", content: "UI/UX Designer & Frontend Developer." },
    ],
  }),
  component: AboutPage,
});

const skills = [
  { label: "UI/UX Design", value: 90 },
  { label: "Web Development", value: 85 },
  { label: "AI Workflow Automation", value: 80 },
  { label: "Mobile App Development", value: 65 },
];

function AboutPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    gsap.from(".about-title span", { y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    gsap.from(".about-lede", { y: 20, opacity: 0, duration: 0.6, delay: 0.2 });

    // Hand 2.5D — subtle mouse parallax
    const hand = heroRef.current?.querySelector(".about-hand") as HTMLElement | null;
    const hl = heroRef.current?.querySelector(".about-hand-hl") as HTMLElement | null;
    if (hand && heroRef.current) {
      const onMove = (e: MouseEvent) => {
        const r = heroRef.current!.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 20;
        gsap.to(hand, { x: x, y: y, rotateY: x * 0.4, rotateX: -y * 0.4, duration: 0.8, ease: "power2.out" });
        if (hl) gsap.to(hl, { x: x * 1.4, y: y * 1.4, duration: 0.9, ease: "power2.out" });
      };
      heroRef.current.addEventListener("mousemove", onMove);
      // parallax on scroll for hand
      gsap.to(hand, {
        yPercent: -6,
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      return () => {
        heroRef.current?.removeEventListener("mousemove", onMove);
        ScrollTrigger.getAll().forEach((s) => s.kill());
      };
    }

    // Skills bars
    gsap.utils.toArray<HTMLElement>(".skill-bar").forEach((bar) => {
      const pct = bar.dataset.pct ?? "50";
      gsap.fromTo(
        bar.querySelector(".skill-fill")!,
        { width: "0%" },
        { width: `${pct}%`, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 85%" } }
      );
    });

    // stats
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count ?? "0", 10);
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.4,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate() {
            el.innerText = Math.round(Number(el.innerText)) + "+";
          },
        }
      );
    });
  }, []);

  return (
    <div className="relative bg-vmm-canvas">
      <Nav />

      <section ref={heroRef} className="relative w-full overflow-hidden pt-28 md:pt-40">
        <Orbs
          items={[
            { size: "m", top: "14%", left: "18%", opacity: 0.55 },
            { size: "s", top: "20%", right: "38%", opacity: 0.4 },
            { size: "s", bottom: "20%", right: "8%", opacity: 0.45 },
            { size: "s", bottom: "10%", left: "6%", opacity: 0.4 },
          ]}
        />
        <LeftRail />

        <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 pb-16 md:grid-cols-12 md:px-16 md:pb-24 lg:px-24">
          <div className="md:col-span-4 md:pt-8">
            <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">ABOUT ME</p>
            <h1 className="about-title mt-4 font-display text-6xl leading-[0.9] md:text-7xl lg:text-8xl">
              <span className="block">I DESIGN<span className="text-vmm-red">.</span></span>
              <span className="block">I BUILD<span className="text-vmm-red">.</span></span>
              <span className="block">I SOLVE<span className="text-vmm-red">.</span></span>
            </h1>
            <p className="about-lede mt-6 max-w-sm text-base leading-relaxed text-vmm-ink/80">
              I'm a UI/UX Designer and Frontend Developer who loves turning ideas into intuitive, functional, and visually stunning digital products.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              <Stat icon={<CalendarDays className="h-5 w-5" />} n={3} label="Years experience" />
              <Stat icon={<FolderCheck className="h-5 w-5" />} n={20} label="Projects completed" />
              <Stat icon={<Users className="h-5 w-5" />} n={10} label="Happy clients" />
            </div>
          </div>

          <div className="relative md:col-span-4">
            <div className="relative mx-auto aspect-square w-full max-w-[520px]" style={{ perspective: 1000 }}>
              {/* red square behind hand */}
              <div
                aria-hidden
                className="absolute right-[8%] top-[8%] h-[62%] w-[62%] bg-vmm-red"
              />
              <img
                src={hand.url}
                alt=""
                className="about-hand relative z-10 h-full w-full select-none object-contain"
                style={{ transformStyle: "preserve-3d" }}
              />
              <img
                src={handHl.url}
                alt=""
                aria-hidden
                className="about-hand-hl pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-contain mix-blend-screen opacity-70"
              />
            </div>
          </div>

          <div className="md:col-span-4 md:pt-8">
            <h2 className="font-display text-2xl">MY EXPERTISE</h2>
            <div className="mt-6 space-y-6">
              {skills.map((s) => (
                <div key={s.label} className="skill-bar" data-pct={s.value}>
                  <div className="flex items-baseline justify-between text-sm font-bold">
                    <span className="tracking-wide">{s.label.toUpperCase()}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="mt-3 h-[3px] w-full bg-vmm-line">
                    <div className="skill-fill h-full bg-vmm-ink" style={{ width: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PageNumber n="002" />
      </section>

      <HomeToolsStrip />
      <HomeFooter />
    </div>
  );
}

function Stat({ icon, n, label }: { icon: React.ReactNode; n: number; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-vmm-red/10 text-vmm-red">{icon}</span>
        <div className="font-display text-3xl" data-count={n}>
          0+
        </div>
      </div>
      <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-vmm-ink/70">{label}</div>
    </div>
  );
}
