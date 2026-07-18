import { useEffect, useRef, useState } from "react";
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

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.pause();
    try { v.currentTime = 0; } catch { /* noop */ }
  }, []);

  useGsap(({ gsap, ScrollTrigger }) => {
    gsap.from(".about-title span", {
      y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current!, start: "top 70%" },
    });

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const v = videoRef.current;
    const section = sectionRef.current;
    if (v && section && !prefersReduced) {
      const attach = () => {
        const dur = v.duration || 2.07;
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress));
            try { v.currentTime = Math.min(dur - 0.02, p * dur); } catch { /* noop */ }
          },
        });
      };
      if (v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) attach();
      else v.addEventListener("loadedmetadata", attach, { once: true });
    }

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
      className="relative w-full bg-vmm-canvas md:h-[280svh]"
      style={{ scrollMarginTop: "80px" }}
    >
      <div
        ref={stickyRef}
        className="relative w-full md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden"
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

        <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-12 md:gap-8 md:px-16 md:py-0 lg:px-24">
          {/* LEFT */}
          <div className="md:col-span-4">
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
          <div className="relative md:col-span-4">
            <div
              className="relative mx-auto flex items-end justify-center"
              style={{ width: "min(36vw, 680px)", height: "min(88svh, 900px)", minHeight: 420 }}
            >
              {reducedMotion ? (
                <img
                  src={handOpen.url}
                  alt=""
                  aria-hidden
                  className="h-full w-full select-none object-contain object-bottom"
                />
              ) : (
                <>
                  <img
                    src={handClosed.url}
                    alt=""
                    aria-hidden
                    className={`absolute inset-0 h-full w-full select-none object-contain object-bottom transition-opacity duration-300 ${videoReady ? "opacity-0" : "opacity-100"}`}
                  />
                  <video
                    ref={videoRef}
                    preload="auto"
                    muted
                    playsInline
                    controls={false}
                    disablePictureInPicture
                    aria-hidden
                    poster={handClosed.url}
                    onLoadedData={() => setVideoReady(true)}
                    className={`relative h-full w-full select-none object-contain object-bottom transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
                  >
                    <source src={handWebm.url} type="video/webm" />
                    <source src={handMp4.url} type="video/mp4" />
                  </video>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — expertise */}
          <div className="md:col-span-4">
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
