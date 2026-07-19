import { useRef } from "react";
import { CalendarDays, Users, FolderCheck, ArrowRight } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import { HandRevealFrameSequence } from "@/components/vmm/HandRevealFrameSequence";
import { HandRevealDesktop } from "@/components/vmm/HandRevealDesktop";

const skills = [
  { label: "UI/UX Design", value: 90 },
  { label: "Web Development", value: 85 },
  { label: "AI Workflow Automation", value: 80 },
  { label: "Mobile App Development", value: 65 },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsap(({ gsap }) => {
    gsap.from(".about-title span", {
      y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
    });

    gsap.utils.toArray<HTMLElement>(".skill-bar").forEach((bar) => {
      const pct = bar.dataset.pct ?? "50";
      gsap.fromTo(bar.querySelector(".skill-fill")!, { width: "0%" },
        { width: `${pct}%`, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 90%" } });
      gsap.fromTo(bar.querySelector(".skill-pct")!, { innerText: 0 },
        { innerText: parseInt(pct, 10), duration: 1.4, ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: bar, start: "top 90%" },
          onUpdate() {
            const el = bar.querySelector<HTMLElement>(".skill-pct")!;
            el.textContent = Math.round(Number(el.textContent)) + "%";
          } });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count ?? "0", 10);
      gsap.fromTo(el, { innerText: 0 },
        { innerText: target, duration: 1.4, ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate() { el.textContent = Math.round(Number(el.textContent)) + "+"; } });
    });
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About"
      className="relative w-full bg-vmm-canvas h-[220svh] md:h-[270svh]"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="sticky top-0 min-h-[100svh] w-full overflow-hidden md:flex md:items-center">
        <Orbs
          items={[
            { size: "m", top: "10%", left: "22%", opacity: 0.55 },
            { size: "s", top: "18%", right: "34%", opacity: 0.4 },
            { size: "s", bottom: "22%", right: "8%", opacity: 0.45 },
            { size: "s", bottom: "12%", left: "8%", opacity: 0.4 },
          ]}
        />
        <LeftRail />

        {/* ============== DESKTOP LAYOUT ============== */}
        <div className="mx-auto hidden w-full max-w-[1760px] gap-8 px-16 py-0 md:grid lg:px-24 md:[grid-template-columns:minmax(0,34%)_minmax(360px,32%)_minmax(0,34%)]">
          {/* LEFT */}
          <div className="relative z-[3]">
            <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">ABOUT ME</p>
            <h2 className="about-title mt-5 font-display uppercase leading-[0.9] text-vmm-ink"
              style={{ fontSize: "clamp(48px, 6vw, 96px)", letterSpacing: "-0.02em" }}>
              <span className="block">I DESIGN<span className="text-vmm-red">.</span></span>
              <span className="block">I BUILD<span className="text-vmm-red">.</span></span>
              <span className="block">I SOLVE<span className="text-vmm-red">.</span></span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-vmm-ink/80">
              I'm a UI/UX Designer and Frontend Developer who loves turning ideas into intuitive, functional, and visually stunning digital products.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              <Stat icon={<CalendarDays className="h-5 w-5" />} n={3} label="Years experience" />
              <Stat icon={<FolderCheck className="h-5 w-5" />} n={20} label="Projects completed" />
              <Stat icon={<Users className="h-5 w-5" />} n={10} label="Happy clients" />
            </div>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-6 bg-vmm-ink px-7 py-4 text-[12px] font-bold tracking-[0.22em] text-white transition-transform hover:-translate-y-0.5"
            >
              LET'S WORK TOGETHER <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* CENTER — hand frame sequence (exact-sync v7: hand opens as logo arc reveals) */}
          <div
            className="relative z-[1] pointer-events-none mx-auto flex w-full items-end justify-center"
            style={{ height: "min(86svh, 820px)" }}
          >
            <HandRevealFrameSequence sectionRef={sectionRef} progressBias={1} />
          </div>


          {/* RIGHT — expertise */}
          <div className="relative z-[3] bg-transparent">
            <h3 className="font-display text-xl tracking-wide">MY EXPERTISE</h3>
            <div className="mt-8 space-y-6">
              {skills.map((s) => (
                <div key={s.label} className="skill-bar" data-pct={s.value}>
                  <div className="flex items-baseline justify-between text-[13px] font-bold">
                    <span className="tracking-[0.14em]">{s.label.toUpperCase()}</span>
                    <span className="skill-pct tabular-nums">0%</span>
                  </div>
                  <div className="mt-3 h-[3px] w-full bg-vmm-line">
                    <div className="skill-fill h-full bg-vmm-ink" style={{ width: 0 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-vmm-line pt-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-vmm-ink/70">Projects</div>
                <div className="mt-2 font-display text-4xl" data-count={20}>0+</div>
              </div>
              <div className="border-l border-vmm-line pl-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-vmm-ink/70">Experience</div>
                <div className="mt-2 font-display text-4xl">
                  <span data-count={3}>0+</span> <span className="text-lg font-bold tracking-widest">YEARS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop 002 badge */}
        <div className="pointer-events-none absolute bottom-8 left-6 z-[6] hidden items-end gap-4 md:flex lg:left-8 xl:left-10">
          <div
            className="font-display font-black leading-[0.82] text-vmm-ink"
            style={{ fontSize: "clamp(64px, 6.2vw, 104px)", letterSpacing: "-0.02em" }}
          >
            002
          </div>
          <div className="mb-3 h-px w-10 bg-vmm-ink/60" />
        </div>

        {/* ============== MOBILE LAYOUT ============== */}
        <div className="w-full px-5 pt-8 pb-10 md:hidden">
          {/* Top block: text left, hand right */}
          <div className="relative grid grid-cols-[minmax(0,1fr)_56%] gap-2">
            <div className="relative z-[3] min-w-0">
              <p className="text-[11px] font-bold tracking-[0.28em] text-vmm-red">ABOUT ME</p>
              <h2
                className="about-title mt-3 font-display uppercase leading-[0.92] text-vmm-ink"
                style={{ fontSize: "clamp(30px, 9.2vw, 46px)", letterSpacing: "-0.02em" }}
              >
                <span className="block">I DESIGN<span className="text-vmm-red">.</span></span>
                <span className="block">I BUILD<span className="text-vmm-red">.</span></span>
                <span className="block">I SOLVE<span className="text-vmm-red">.</span></span>
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-vmm-ink/80">
                I'm a UI/UX Designer and Frontend Developer who loves turning ideas into intuitive, functional, and visually stunning digital products.
              </p>

              <a
                href="#contact"
                className="mt-5 flex w-full items-center justify-between gap-4 bg-vmm-ink px-5 py-4 text-[11px] font-bold tracking-[0.22em] text-white"
              >
                LET'S WORK TOGETHER <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="mt-3 flex w-full items-center justify-between gap-4 bg-vmm-red px-5 py-4 text-[11px] font-bold tracking-[0.22em] leading-tight text-white"
              >
                <span>
                  AVAILABLE<br />FOR FREELANCE
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
            </div>

            {/* Hand — right column, wrist anchored bottom, sized by viewport so it reads at ~64vw */}
            <div className="pointer-events-none relative z-[2] self-stretch min-h-[380px]">
              <div className="absolute bottom-0 right-[-20px] top-0 flex w-[64vw] items-end justify-end">
                <HandRevealFrameSequence sectionRef={sectionRef} progressBias={1.4} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-2 border-y border-vmm-line py-5">
            <Stat icon={<CalendarDays className="h-4 w-4" />} n={3} label="Years experience" />
            <div className="border-l border-vmm-line pl-2">
              <Stat icon={<FolderCheck className="h-4 w-4" />} n={20} label="Projects completed" />
            </div>
            <div className="border-l border-vmm-line pl-2">
              <Stat icon={<Users className="h-4 w-4" />} n={10} label="Happy clients" />
            </div>
          </div>

          {/* Expertise */}
          <div className="mt-8">
            <h3 className="font-display text-lg tracking-wide">MY EXPERTISE</h3>
            <div className="mt-5 space-y-5">
              {skills.map((s) => (
                <div key={s.label} className="skill-bar" data-pct={s.value}>
                  <div className="flex items-baseline justify-between text-[12px] font-bold">
                    <span className="tracking-[0.14em]">{s.label.toUpperCase()}</span>
                    <span className="skill-pct tabular-nums">0%</span>
                  </div>
                  <div className="mt-2 h-[3px] w-full bg-vmm-line">
                    <div className="skill-fill h-full bg-vmm-ink" style={{ width: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: 002 red badge + scroll indicator */}
          <div className="mt-10 flex items-end justify-between">
            <div className="relative bg-vmm-red px-4 pt-3 pb-2 text-vmm-ink">
              <div
                className="font-display font-black leading-[0.85]"
                style={{ fontSize: "56px", letterSpacing: "-0.02em" }}
              >
                002
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-vmm-ink text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="8" y="4" width="8" height="14" rx="4" />
                  <line x1="12" y1="8" x2="12" y2="11" />
                </svg>
              </div>
              <div className="text-[11px] font-bold uppercase leading-tight tracking-[0.2em] text-vmm-ink">
                SCROLL<br />DOWN
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, n, label }: { icon: React.ReactNode; n: number; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-vmm-red/10 text-vmm-red">{icon}</span>
        <div className="font-display text-2xl md:text-3xl" data-count={n}>0+</div>
      </div>
      <div className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.16em] text-vmm-ink/70 md:text-[11px] md:tracking-[0.18em]">{label}</div>
    </div>
  );
}
