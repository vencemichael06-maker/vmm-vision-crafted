import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, CalendarDays, Users, FolderCheck } from "lucide-react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, PageNumber } from "@/components/vmm/SideRail";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";
import handVideo from "@/assets/vmm/hand_logo_reveal.mp4.asset.json";
import handLast from "@/assets/vmm/hand_logo_reveal_last.png.asset.json";
import handFirst from "@/assets/vmm/hand_logo_reveal_first.jpg.asset.json";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preload video metadata so ScrollTrigger has duration ready
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {
      /* noop */
    }
  }, []);

  useGsap(({ gsap, ScrollTrigger }) => {
    // Headline reveal
    gsap.from(".about-title span", { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
    gsap.from(".about-lede, .about-eyebrow, .about-cta, .about-stats > *", {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out", delay: 0.2,
    });

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll-scrubbed hand + logo reveal (rAF-smoothed currentTime updates)
    const v = videoRef.current;
    const stage = heroRef.current?.querySelector<HTMLDivElement>(".hand-stage");
    if (v && stage && !prefersReduced) {
      let targetTime = 0;
      let rafId: number | null = null;
      const tick = () => {
        rafId = null;
        const cur = v.currentTime;
        const diff = targetTime - cur;
        if (Math.abs(diff) < 0.01) return;
        // Ease toward target for silky reversible scrub
        try { v.currentTime = cur + diff * 0.35; } catch { /* noop */ }
        rafId = requestAnimationFrame(tick);
      };

      const attach = () => {
        const dur = v.duration || 2.07;
        ScrollTrigger.create({
          trigger: stage,
          start: "top 82%",
          end: "bottom 25%",
          scrub: false,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress));
            targetTime = Math.min(dur - 0.03, p * dur);
            if (rafId == null) rafId = requestAnimationFrame(tick);
          },
        });
      };
      if (v.readyState >= 1 && !Number.isNaN(v.duration)) attach();
      else v.addEventListener("loadedmetadata", attach, { once: true });
    } else if (v && prefersReduced) {
      try { v.currentTime = 0; } catch { /* noop */ }
    }

    // Skill bar fills
    gsap.utils.toArray<HTMLElement>(".skill-bar").forEach((bar) => {
      const pct = bar.dataset.pct ?? "50";
      gsap.fromTo(
        bar.querySelector(".skill-fill")!,
        { width: "0%" },
        { width: `${pct}%`, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 88%" } }
      );
      gsap.fromTo(
        bar.querySelector(".skill-pct")!,
        { innerText: 0 },
        {
          innerText: parseInt(pct, 10),
          duration: 1.4,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: bar, start: "top 88%" },
          onUpdate() {
            const el = bar.querySelector<HTMLElement>(".skill-pct")!;
            el.textContent = Math.round(Number(el.textContent)) + "%";
          },
        }
      );
    });

    // Counting stats
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
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate() {
            el.textContent = Math.round(Number(el.textContent)) + "+";
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);

  return (
    <div className="relative bg-vmm-canvas">
      <Nav />

      <section
        ref={heroRef}
        className="relative w-full overflow-hidden pt-28 md:min-h-[100svh] md:pt-32"
      >
        <Orbs
          items={[
            { size: "m", top: "10%", left: "22%", opacity: 0.55 },
            { size: "s", top: "18%", right: "34%", opacity: 0.4 },
            { size: "s", bottom: "22%", right: "8%", opacity: 0.45 },
            { size: "s", bottom: "12%", left: "8%", opacity: 0.4 },
          ]}
        />
        <LeftRail />

        <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 pb-24 md:grid-cols-12 md:gap-8 md:px-16 md:pb-24 lg:px-24">
          {/* LEFT COLUMN */}
          <div className="md:col-span-4 md:pt-4">
            <p className="about-eyebrow text-[13px] font-bold tracking-[0.28em] text-vmm-red">ABOUT ME</p>
            <h1 className="about-title mt-5 font-display uppercase leading-[0.9] text-vmm-ink"
              style={{ fontSize: "clamp(48px, 6vw, 96px)", letterSpacing: "-0.02em" }}>
              <span className="block">I DESIGN<span className="text-vmm-red">.</span></span>
              <span className="block">I BUILD<span className="text-vmm-red">.</span></span>
              <span className="block">I SOLVE<span className="text-vmm-red">.</span></span>
            </h1>
            <p className="about-lede mt-6 max-w-sm text-[15px] leading-relaxed text-vmm-ink/80">
              I'm a UI/UX Designer and Frontend Developer who loves turning ideas into intuitive, functional, and visually stunning digital products.
            </p>

            <div className="about-stats mt-10 grid grid-cols-3 gap-4 md:gap-6">
              <Stat icon={<CalendarDays className="h-5 w-5" />} n={3} label="Years experience" />
              <Stat icon={<FolderCheck className="h-5 w-5" />} n={20} label="Projects completed" />
              <Stat icon={<Users className="h-5 w-5" />} n={10} label="Happy clients" />
            </div>

            <a
              href="/contact"
              className="about-cta mt-12 inline-flex items-center gap-6 bg-vmm-ink px-7 py-4 text-[12px] font-bold tracking-[0.22em] text-white transition-transform hover:-translate-y-0.5"
            >
              LET'S WORK TOGETHER <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* CENTER — HAND MOTION STAGE */}
          <div className="relative md:col-span-4">
            <div
              className="hand-stage relative mx-auto aspect-[1086/1448] w-full max-w-[560px]"
            >
              <video
                ref={videoRef}
                src={handVideo.url}
                poster={handFirst.url}
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                aria-hidden
                className="absolute inset-0 h-full w-full select-none object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — EXPERTISE */}
          <div className="md:col-span-4 md:pt-4">
            <h2 className="font-display text-xl tracking-wide">MY EXPERTISE</h2>
            <div className="mt-8 space-y-7">
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

            <div className="mt-16 grid grid-cols-2 gap-6 border-t border-vmm-line pt-8">
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

        <PageNumber n="002" />
      </section>

      <HomeFooter />
    </div>
  );
}

function Stat({ icon, n, label }: { icon: React.ReactNode; n: number; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-vmm-red/10 text-vmm-red">{icon}</span>
        <div className="font-display text-3xl" data-count={n}>0+</div>
      </div>
      <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-vmm-ink/70">{label}</div>
    </div>
  );
}
