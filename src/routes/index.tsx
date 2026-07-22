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
      { title: "VMM — Vence Michael Montero · UI/UX Designer & Web Developer" },
      {
        name: "description",
        content: "I design and build digital experiences that are clean, modern and impactful.",
      },
      {
        property: "og:title",
        content: "VMM — Vence Michael Montero · UI/UX Designer & Web Developer",
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
          className="relative min-h-[100svh] w-full overflow-hidden bg-vmm-canvas"
        >
          <LeftRail />
          <RightRail />

          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <span className="vmm-orb left-[34%] top-[16%] hidden h-20 w-20 opacity-55 md:block" />
            <span className="vmm-orb left-[22%] top-[31%] hidden h-36 w-36 opacity-55 md:block" />
            <span className="vmm-orb right-[9%] top-[18%] h-24 w-24 opacity-45 md:h-32 md:w-32" />
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 top-[12%] z-[1] w-[55%] bg-vmm-red md:top-[18%] md:w-[48%] lg:top-[20%] lg:w-[43%]"
            style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)" }}
          />

          <div className="vmm-container relative z-[3] grid min-h-[100svh] grid-cols-12 items-start pb-24 pt-28 md:items-center md:pb-20 md:pt-28 lg:pt-24">
            <div
              className="col-span-8 self-start pr-1 sm:col-span-7 md:col-span-9 md:self-center lg:col-span-6 lg:col-start-2"
              data-hero-reveal
            >
              <p className="vmm-kicker">HELLO, I&apos;M</p>
              <h1
                data-testid="hero-title"
                className="vmm-hero-title mt-4 font-display uppercase text-vmm-ink"
              >
                <span className="block md:inline">
                  VENCE<span className="hidden md:inline"> </span>
                </span>
                <span className="block md:inline">MICHAEL</span>
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

          <div className="pointer-events-none absolute bottom-0 right-[-30%] top-[7%] z-[2] w-[76%] sm:right-[-16%] sm:w-[67%] md:right-[2%] md:top-[7%] md:w-[52%] lg:right-[8%] lg:top-[7%] lg:w-[39%] xl:right-[10%]">
            <HeroPersonGlitch />
          </div>

          <div className="absolute bottom-5 left-5 z-[4] flex items-end gap-3 md:hidden">
            <span className="font-display text-[3.5rem] font-black leading-none">001</span>
            <span className="mb-2 h-px w-8 bg-vmm-ink" aria-hidden="true" />
          </div>
          <PageNumber n="001" />

          <div className="absolute bottom-6 right-5 z-[4] hidden items-center gap-3 md:flex lg:right-10">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-vmm-ink text-white">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold leading-tight tracking-[0.22em]">
              SCROLL
              <br />
              DOWN
            </span>
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
