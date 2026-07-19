import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { useRef } from "react";
import { Nav } from "@/components/vmm/Nav";
import { LeftRail, RightRail, PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import { AboutSection } from "@/sections/AboutSection";
import { WorkSection } from "@/sections/WorkSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { ContactSection } from "@/sections/ContactSection";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { HeroPersonGlitch } from "@/components/vmm/HeroPersonGlitch";
import { LoadCurtain } from "@/components/vmm/LoadCurtain";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VMM — Vence Michael Montero · UI/UX Designer & Web Developer" },
      { name: "description", content: "I design and build digital experiences that are clean, modern and impactful." },
      { property: "og:title", content: "VMM — Vence Michael Montero · UI/UX Designer & Web Developer" },
      { property: "og:description", content: "I design and build digital experiences that are clean, modern and impactful." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".vmm-hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
      .from(".vmm-hero-title span", { y: 60, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.3")
      .from(".vmm-hero-lede", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".vmm-hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".vmm-hero-red-panel", { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power4.inOut" }, 0.15)
      .from(".vmm-hero-person", { y: 60, opacity: 0, duration: 1.2, ease: "power4.out" }, 0.2);

    gsap.to(".vmm-hero-person", {
      yPercent: -8,
      scrollTrigger: { trigger: heroRef.current!, start: "top top", end: "bottom top", scrub: 1 },
    });

    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);

  return (
    <div className="relative bg-vmm-canvas text-vmm-ink">
      <Nav />
      <main>
        {/* ============ PAGE 001 — HOME / HERO ============ */}
        <section
          id="home"
          ref={heroRef}
          aria-label="Home"
          className="relative w-full overflow-x-clip bg-vmm-canvas md:h-[100svh] md:min-h-[720px] md:overflow-hidden"
          style={{ scrollMarginTop: "0px" }}
        >
          {/* Decorative circles (desktop) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="absolute rounded-full bg-white" style={{ top: "12%", left: "24%", width: "clamp(140px, 12vw, 190px)", height: "clamp(140px, 12vw, 190px)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.04)", opacity: 0.9 }} />
            <div className="absolute rounded-full bg-white" style={{ top: "6%", left: "34%", width: "clamp(70px, 6vw, 96px)", height: "clamp(70px, 6vw, 96px)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)", opacity: 0.85 }} />
            <div className="absolute rounded-full bg-white" style={{ top: "22%", right: "18%", width: "clamp(90px, 7vw, 110px)", height: "clamp(90px, 7vw, 110px)", boxShadow: "inset 0 0 24px rgba(0,0,0,0.05)", opacity: 0.85 }} />
            <div className="absolute rounded-full bg-white" style={{ bottom: "10%", left: "12%", width: "clamp(70px, 6vw, 100px)", height: "clamp(70px, 6vw, 100px)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)", opacity: 0.85 }} />
          </div>

          <LeftRail />
          <RightRail />

          <div aria-hidden className="vmm-hero-red-panel absolute hidden bg-vmm-red md:block" style={{ left: "43vw", top: "51vh", right: 0, bottom: 0 }} />

          {/* Desktop */}
          <div className="relative hidden h-full w-full md:block">
            <div className="absolute z-[5] max-w-[42vw]" style={{ left: "13vw", top: "33vh" }}>
              <p className="vmm-hero-eyebrow text-[13px] font-bold tracking-[0.32em] text-vmm-red">HELLO, I&apos;M</p>
              <h1 className="vmm-hero-title mt-5 font-display uppercase text-vmm-ink"
                style={{ fontSize: "clamp(52px, 4.7vw, 88px)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
                <span className="block">VENCE MICHAEL</span>
                <span className="block">MONTERO<span className="text-vmm-red">.</span></span>
              </h1>
              <p className="vmm-hero-lede mt-6 max-w-[26rem] text-[15px] leading-[1.6] text-vmm-ink/80" style={{ marginTop: "clamp(24px, 4.2vh, 44px)" }}>
                I design and build digital experiences that are clean, modern, and impactful.
              </p>
              <a href="#work" className="vmm-hero-cta mt-8 inline-flex items-center gap-6 bg-vmm-ink px-7 py-4 text-[12px] font-bold tracking-[0.22em] text-white transition-transform hover:-translate-y-0.5" style={{ marginTop: "clamp(24px, 4vh, 42px)" }}>
                VIEW MY WORK <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="pointer-events-none absolute z-[4]" style={{ right: "clamp(120px, 14.5vw, 240px)", bottom: 0, width: "clamp(460px, 34vw, 660px)", height: "clamp(640px, 88vh, 920px)" }}>
              <div className="vmm-hero-person h-full w-full">
                <HeroPersonGlitch />
              </div>
            </div>

          </div>

          {/* Mobile hero */}
          <MobileHero />

          <PageNumber n="001" />

          <div className="pointer-events-none absolute bottom-8 z-[6] hidden flex-col items-center gap-3 md:flex" style={{ right: "clamp(24px, 3vw, 48px)" }}>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-vmm-ink text-white">
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
                <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6.25" y="4.5" width="1.5" height="4" rx="0.75" fill="currentColor" />
              </svg>
            </div>
            <div className="text-center text-[10.5px] font-bold leading-tight tracking-[0.28em] text-vmm-ink">SCROLL<br />DOWN</div>
          </div>
        </section>

        {/* ============ PAGE 002 — ABOUT ============ */}
        <AboutSection />

        {/* ============ PAGE 003 — WORK ============ */}
        <WorkSection />

        {/* ============ PAGE 004 — SERVICES ============ */}
        <ServicesSection />

        {/* ============ PAGE 005 — CONTACT ============ */}
        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}

function MobileHero() {
  // Reference-accurate mobile hero: single continuous person bridging the
  // white → red seam. White band holds copy; red band holds 001 + rail +
  // scroll cue. The person image spans both bands anchored bottom-right.
  return (
    <div className="relative block overflow-hidden md:hidden">
      {/* Two-tone canvas */}
      <div className="relative bg-vmm-canvas" style={{ paddingTop: "calc(env(safe-area-inset-top) + 76px)" }}>
        {/* Decorative circles */}
        <div aria-hidden className="pointer-events-none absolute right-[-40px] top-[110px] h-40 w-40 rounded-full bg-black/[0.04]" />
        <div aria-hidden className="pointer-events-none absolute right-[-70px] top-[60px] h-24 w-24 rounded-full bg-black/[0.06]" />

        {/* Copy column */}
        <div className="relative z-[3] px-5 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-vmm-red">HELLO, I&apos;M</p>
          <h1 className="mt-3 font-display uppercase text-vmm-ink" style={{ fontSize: "clamp(40px, 13vw, 60px)", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
            <span className="block">VENCE</span>
            <span className="block">MICHAEL</span>
            <span className="block">MONTERO<span className="text-vmm-red">.</span></span>
          </h1>
          <p className="mt-5 max-w-[62%] text-[13.5px] leading-[1.55] text-vmm-ink/80">
            I design and build digital experiences that are clean, modern, and impactful.
          </p>
          <a href="#work" aria-label="View my work" className="mt-6 inline-flex min-h-[48px] items-center gap-6 bg-vmm-ink px-6 text-[12px] font-bold tracking-[0.22em] text-white">
            VIEW MY WORK <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Vertical PHILIPPINES rail on right (over white band only) */}
        <div className="pointer-events-none absolute right-2 z-[2] text-vmm-ink" style={{ top: "calc(env(safe-area-inset-top) + 120px)" }}>
          <div className="flex flex-col items-center gap-2 font-bold uppercase" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.3em" }} className="opacity-80">BASED IN</span>
            <span className="font-black" style={{ fontSize: "13px", letterSpacing: "0.22em" }}>PHILIPPINES</span>
            <span style={{ fontSize: "10px", letterSpacing: "0.3em" }} className="opacity-80">AVAILABLE FOR FREELANCE</span>
          </div>
        </div>
      </div>

      {/* Red band */}
      <div className="relative bg-[color:var(--vmm-red)] px-5 pt-10 pb-[calc(env(safe-area-inset-bottom)+40px)]" style={{ minHeight: "56vh" }}>
        <div className="relative z-[3] flex max-w-[46%] flex-col gap-8">
          <div className="flex items-start gap-4">
            <div
              aria-hidden
              className="font-display font-black leading-[0.85] text-vmm-ink"
              style={{ fontSize: "clamp(64px, 20vw, 104px)", letterSpacing: "-0.02em" }}
            >
              001
            </div>
          </div>
          <div>
            <div className="h-px w-6 bg-vmm-ink" />
            <div className="mt-3 text-[10.5px] font-bold leading-tight tracking-[0.24em] text-vmm-ink">
              UI/UX DESIGNER<br />&amp; WEB DEVELOPER
            </div>
          </div>
          <div className="mt-6 flex flex-col items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-vmm-ink text-white">
              <MousePointer2 className="h-4 w-4" />
            </div>
            <div className="text-[10.5px] font-bold leading-tight tracking-[0.24em] text-vmm-ink">
              SCROLL<br />DOWN
            </div>
          </div>
        </div>
      </div>

      {/* Single continuous person, bridging both bands, bottom-anchored */}
      <div
        className="pointer-events-none absolute right-0 z-[4]"
        style={{
          bottom: 0,
          width: "min(74vw, 440px)",
          height: "78%",
          marginRight: "-4vw",
        }}
      >
        <HeroPersonGlitch />
      </div>
    </div>
  );
}
