import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { HeroPersonGlitch } from "@/components/vmm/HeroPersonGlitch";
import { Nav } from "@/components/vmm/Nav";
import { LeftRail, PageNumber, RightRail } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import { AboutSection } from "@/sections/AboutSection";
import { ContactSection } from "@/sections/ContactSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { WorkSection } from "@/sections/WorkSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VMM - UI/UX Designer & Web Developer" },
      {
        name: "description",
        content: "I design and build digital experiences that are clean, modern and impactful.",
      },
      {
        property: "og:title",
        content: "VMM - UI/UX Designer & Web Developer",
      },
      {
        property: "og:description",
        content: "I design and build digital experiences that are clean, modern and impactful.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGsap(({ gsap }) => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
    gsap.fromTo(
      items,
      { y: 28, opacity: 0.01 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: "power3.out", delay: 0.12 },
    );
  }, []);

  return (
    <div className="bg-vmm-canvas text-vmm-ink">
      <a className="vmm-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section
          id="home"
          ref={heroRef}
          aria-label="Home"
          className="relative w-full bg-vmm-canvas md:min-h-[100svh] md:overflow-hidden"
        >
          <LeftRail />
          <RightRail />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="vmm-orb left-[34%] top-[16%] hidden h-20 w-20 opacity-55 md:block" />
            <span className="vmm-orb left-[22%] top-[31%] hidden h-36 w-36 opacity-55 md:block" />
            <span className="vmm-orb right-[9%] top-[18%] h-24 w-24 opacity-45 md:h-32 md:w-32" />
          </div>

          {/* Desktop: angled red panel */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 z-[1] hidden bg-vmm-red md:block md:top-[18%] md:w-[48%] lg:top-[20%] lg:w-[43%]"
            style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)" }}
          />

          {/* ============ MOBILE HERO (natural flow, no clipping) ============ */}
          <div className="md:hidden">
            <div className="vmm-container relative z-[3] pt-24" data-hero-reveal>
              <p className="vmm-kicker">HELLO, I&apos;M</p>
              <h1
                data-testid="hero-title"
                className="mt-4 font-display font-black uppercase leading-[0.92] tracking-tight text-vmm-ink"
                style={{ fontSize: "clamp(2.5rem, 14vw, 4.75rem)" }}
              >
                <span className="block">VENCE</span>
                <span className="block">MICHAEL</span>
                <span className="block">
                  MONTERO<span className="text-vmm-red">.</span>
                </span>
              </h1>
              <p className="mt-5 max-w-[31rem] text-[15px] leading-[1.55] text-vmm-ink/80">
                I design and build digital experiences that are clean, modern, and impactful.
              </p>
            </div>

            {/* Red section holding the figure — natural aspect, contain, no crop */}
            <div className="relative mt-8 w-full bg-vmm-red">
              {/* CTA overlapping seam */}
              <div className="vmm-container relative z-[4] -mt-6">
                <a href="#work" className="vmm-button">
                  VIEW MY WORK <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              {/* Vertical 001 badge, in-flow beside figure */}
              <div className="pointer-events-none absolute left-3 top-6 z-[3] flex flex-col items-center gap-2">
                <span
                  className="font-display font-black leading-none tracking-tight text-vmm-ink"
                  style={{
                    fontSize: "clamp(64px, 20vw, 128px)",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  001
                </span>
                <span className="h-8 w-px bg-vmm-ink" aria-hidden="true" />
              </div>

              {/* Figure — object-contain, natural aspect, never cropped */}
              <div
                className="relative mx-auto w-full"
                style={{ maxWidth: "560px", aspectRatio: "3 / 4" }}
              >
                <HeroPersonGlitch />
              </div>
            </div>
          </div>

          {/* ============ DESKTOP / TABLET HERO (absolute composition) ============ */}
          <div className="hidden md:block">
            <div className="vmm-container relative z-[3] grid min-h-[100svh] grid-cols-12 items-center pb-20 pt-28 lg:pt-24">
              <div
                className="col-span-8 self-center pr-1 lg:col-span-7 lg:col-start-2 xl:col-span-6"
                data-hero-reveal
              >
                <p className="vmm-kicker">HELLO, I&apos;M</p>
                <h1className="vmm-hero-title mt-4 font-display uppercase text-vmm-ink">
                  VENCE MICHAEL
                  <span className="block">
                    MONTERO<span className="text-vmm-red">.</span>
                  </span>
                </h1>
                <p className="mt-5 max-w-[31rem] text-[15px] leading-[1.55] text-vmm-ink/80 md:mt-7 md:text-base">
                  I design and build digital experiences that are clean, modern, and impactful.
                </p>
                <a href="#work" className="vmm-button mt-6 md:mt-8">
                  VIEW MY WORK <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[2%] top-[7%] z-[2] h-auto w-[52%] lg:right-[8%] lg:w-[39%] xl:right-[10%]">
              <HeroPersonGlitch />
            </div>

            <PageNumber n="001" />

            <div className="absolute bottom-6 right-5 z-[4] flex items-center gap-3 lg:right-10">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-vmm-ink text-white">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-bold leading-tight tracking-[0.22em]">
                SCROLL
                <br />
                DOWN
              </span>
            </div>
          </div>
        </section>


        <AboutSection />
        <WorkSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <HomeFooter />
    </div>
  );
}
