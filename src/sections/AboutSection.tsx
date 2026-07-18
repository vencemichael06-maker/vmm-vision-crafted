import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Users, FolderCheck, ArrowRight } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import handWebm from "@/assets/vmm/hand_reveal_transparent_v2.webm.asset.json";
import handMp4 from "@/assets/vmm/hand_reveal_paper.mp4.asset.json";
import handClosed from "@/assets/vmm/hand_closed.png.asset.json";
import handOpen from "@/assets/vmm/hand_open.png.asset.json";

const skills = [
  { label: "UI/UX Design", value: 90 },
  { label: "Web Development", value: 85 },
  { label: "AI Workflow Automation", value: 80 },
  { label: "Mobile App Development", value: 65 },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    try { video.currentTime = 0; } catch { /* noop */ }
    setVideoReady(true);
  }, []);

  // Scroll-driven scrub, calculated from the Page 002 section rect only.
  useEffect(() => {
    if (!videoReady || reducedMotion) return;
    let rafId = 0;
    const update = () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video || !video.duration) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = clamp(-rect.top / scrollable, 0, 1);
      const target = progress * Math.max(video.duration - 0.001, 0);
      if (Math.abs(video.currentTime - target) > 0.01) {
        try { video.currentTime = target; } catch { /* noop */ }
      }
    };
    const request = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [videoReady, reducedMotion]);

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
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden md:flex md:items-center">
        <Orbs
          items={[
            { size: "m", top: "10%", left: "22%", opacity: 0.55 },
            { size: "s", top: "18%", right: "34%", opacity: 0.4 },
            { size: "s", bottom: "22%", right: "8%", opacity: 0.45 },
            { size: "s", bottom: "12%", left: "8%", opacity: 0.4 },
          ]}
        />
        <LeftRail />

        <div
          className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 py-20 md:gap-8 md:px-16 md:py-0 lg:px-24"
          style={{
            gridTemplateColumns:
              typeof window !== "undefined" && window.innerWidth >= 768
                ? "minmax(0,34%) minmax(360px,32%) minmax(0,34%)"
                : undefined,
          }}
        >
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

          {/* CENTER — hand */}
          <div className="relative z-[1] flex items-end justify-center pointer-events-none">
            {reducedMotion ? (
              <img
                src={handOpen.url}
                alt=""
                aria-hidden
                style={{ width: "clamp(360px, 31vw, 540px)", height: "auto", maxHeight: "78svh" }}
                className="select-none object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                aria-hidden
                poster={handClosed.url}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ width: "clamp(360px, 31vw, 540px)", height: "auto", maxHeight: "78svh" }}
                className="hand-motion-video block select-none object-contain"
              >
                <source src={handWebm.url} type="video/webm" />
                <source src={handMp4.url} type="video/mp4" />
              </video>
            )}
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

        <PageNumber n="002" />
      </div>
    </section>
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
