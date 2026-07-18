import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { useRef } from "react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { LeftRail, RightRail, PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import heroPerson from "@/assets/vmm/hero_person.png.asset.json";
import heroRed from "@/assets/vmm/hero_person_red.png.asset.json";
import { projects } from "@/lib/vmm/projects";
import { HomeToolsStrip, HomeFooter } from "@/components/vmm/HomeExtras";

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
  const heroRef = useRef<HTMLDivElement | null>(null);

  useGsap(({ gsap, ScrollTrigger }) => {
    if (!heroRef.current) return;

    // Hero entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".vmm-hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
      .from(".vmm-hero-title span", { y: 60, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.3")
      .from(".vmm-hero-lede", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".vmm-hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".vmm-hero-red-panel", { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power4.inOut" }, 0.15)
      .from(".vmm-hero-person", { y: 60, opacity: 0, duration: 1.2, ease: "power4.out" }, 0.2)
      .from(".vmm-hero-red-overlay", { opacity: 0, duration: 0.8 }, "-=0.6");

    // Orb parallax on scroll
    gsap.utils.toArray<HTMLElement>("[data-orb]").forEach((orb, i) => {
      gsap.to(orb, {
        y: (i % 2 === 0 ? -80 : 60) - i * 6,
        x: i % 3 === 0 ? -40 : 20,
        scrollTrigger: { trigger: heroRef.current!, start: "top top", end: "bottom top", scrub: 1 },
      });
    });

    // Person parallax
    gsap.to(".vmm-hero-person", {
      yPercent: -8,
      scrollTrigger: { trigger: heroRef.current!, start: "top top", end: "bottom top", scrub: 1 },
    });
    gsap.to(".vmm-hero-red-overlay", {
      yPercent: -12,
      scrollTrigger: { trigger: heroRef.current!, start: "top top", end: "bottom top", scrub: 1 },
    });

    // Section reveals
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);

  return (
    <div className="relative bg-vmm-canvas text-vmm-ink">
      <Nav />

      {/* HERO */}
      <section ref={heroRef} className="relative w-full overflow-x-clip md:min-h-[100svh] md:overflow-hidden md:pt-32">
        <Orbs
          items={[
            { size: "m", top: "12%", left: "22%", opacity: 0.7 },
            { size: "s", top: "8%", right: "18%", opacity: 0.55 },
            { size: "s", top: "38%", right: "8%", opacity: 0.5 },
            { size: "s", bottom: "18%", left: "3%", opacity: 0.6 },
          ]}
        />
        <LeftRail />
        <RightRail />

        {/* Full-width red panel (desktop) */}
        <div
          aria-hidden
          className="vmm-hero-red-panel absolute right-0 top-[52%] hidden h-[42%] w-[58%] bg-vmm-red md:block"
        />

        {/* ===== DESKTOP / TABLET LAYOUT ===== */}
        <div className="relative mx-auto hidden w-full max-w-[1760px] grid-cols-1 gap-8 px-5 pb-24 md:grid md:grid-cols-12 md:px-16 md:pb-32 lg:px-24">
          <div className="z-10 md:col-span-6 md:pt-10 lg:pt-16">
            <p className="vmm-hero-eyebrow text-[13px] font-bold tracking-[0.28em] text-vmm-red">HELLO, I'M</p>
            <h1 className="vmm-hero-title mt-4 font-display text-[15vw] leading-[0.9] md:text-[6.5vw] lg:text-[5.2vw]">
              <span className="block">VENCE MICHAEL</span>
              <span className="block">
                MONTERO<span className="text-vmm-red">.</span>
              </span>
            </h1>
            <p className="vmm-hero-lede mt-6 max-w-md text-base leading-relaxed text-vmm-ink/80 md:text-lg">
              I design and build digital experiences that are clean, modern, and impactful.
            </p>
            <Link
              to="/work"
              className="vmm-hero-cta mt-8 inline-flex items-center gap-4 rounded-md bg-vmm-ink px-7 py-4 text-[12px] font-bold tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
            >
              VIEW MY WORK <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative md:col-span-6">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[560px] md:absolute md:right-0 md:top-0 md:h-[110%] md:w-[62vw] md:max-w-none">
              <img
                src={heroPerson.url}
                alt="Portrait of Vence Michael Montero"
                className="vmm-hero-person absolute inset-x-0 bottom-0 h-full w-full select-none object-contain object-bottom"
              />
              <img
                src={heroRed.url}
                alt=""
                aria-hidden
                className="vmm-hero-red-overlay absolute inset-x-0 bottom-0 h-full w-full select-none object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        {/* ===== MOBILE LAYOUT (below md) ===== */}
        <MobileHero />



        <PageNumber n="001" />
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-4 md:flex">
          <div className="text-[11px] font-bold tracking-[0.28em]">SCROLL DOWN</div>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-vmm-ink text-white">
            <MousePointer2 className="h-4 w-4" />
          </div>
        </div>
      </section>


      {/* Featured work strip */}
      <section className="relative w-full py-24 md:py-32">
        <div className="mx-auto max-w-[1760px] px-5 md:px-16 lg:px-24">
          <div data-reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">FEATURED WORK</p>
              <h2 className="mt-4 font-display text-5xl md:text-7xl">
                SELECTED PROJECTS<span className="text-vmm-red">.</span>
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-3 self-start text-[12px] font-bold tracking-[0.2em] hover:text-vmm-red"
            >
              VIEW ALL PROJECTS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid place-items-center rounded-xl border border-dashed border-vmm-ink/20 bg-white/40 px-6 py-24 text-center" data-reveal>
            <div className="max-w-lg">
              <p className="text-[11px] font-bold tracking-[0.28em] text-vmm-red">COMING SOON</p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">
                REAL CASE STUDIES, IN PRODUCTION<span className="text-vmm-red">.</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-vmm-ink/70 md:text-base">
                Featured project entries will appear here — each with its own editorial cover, role, stack, and outcome.
              </p>
            </div>
          </div>

        </div>
      </section>

      <HomeToolsStrip />
      <HomeFooter />
    </div>
  );
}

function MobileHero() {
  return (
    <div className="relative block overflow-hidden md:hidden">
      {/* WHITE PANEL */}
      <div
        className="relative bg-vmm-canvas px-5 pb-16"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 88px)" }}
      >
        <div aria-hidden className="pointer-events-none absolute right-[-40px] top-[80px] h-40 w-40 rounded-full bg-black/[0.035]" />
        <div aria-hidden className="pointer-events-none absolute right-[-70px] top-[30px] h-24 w-24 rounded-full bg-black/[0.05]" />

        <div className="relative z-[3]">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-vmm-red">
            HELLO, I&apos;M
          </p>
          <h1
            className="mt-3 font-display uppercase text-vmm-ink"
            style={{
              fontSize: "clamp(40px, 13.2vw, 60px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            <span className="block">VENCE</span>
            <span className="block">MICHAEL</span>
            <span className="block">
              MONTERO<span className="text-vmm-red">.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-[62%] text-[13.5px] leading-[1.55] text-vmm-ink/80">
            I design and build digital experiences that are clean, modern, and impactful.
          </p>
          <Link
            to="/work"
            aria-label="View my work"
            className="mt-6 inline-flex min-h-[48px] items-center gap-6 bg-vmm-ink px-6 text-[12px] font-bold tracking-[0.22em] text-white"
          >
            VIEW MY WORK <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Vertical location rail */}
        <div
          className="pointer-events-none absolute right-2 z-[2] text-vmm-ink"
          style={{ top: "calc(env(safe-area-inset-top) + 130px)" }}
        >
          <div
            className="font-bold uppercase"
            style={{ writingMode: "vertical-rl", letterSpacing: "0.28em", fontSize: "10px" }}
          >
            <span className="opacity-70">BASED IN</span>
            <span className="mx-1 font-black">PHILIPPINES</span>
            <span className="opacity-70">&nbsp;·&nbsp; AVAILABLE FOR FREELANCE</span>
          </div>
        </div>
      </div>

      {/* RED PANEL — contains person as absolute child bridging seam */}
      <div className="relative bg-[color:var(--vmm-red)] px-5 pt-8 pb-[calc(env(safe-area-inset-bottom)+32px)]">
        {/* Left content column */}
        <div className="relative z-[3] flex max-w-[52%] items-start gap-4">
          <div
            aria-hidden
            className="font-display font-black leading-[0.85] text-vmm-ink"
            style={{
              fontSize: "clamp(58px, 17vw, 88px)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "-0.02em",
            }}
          >
            001
          </div>

          <div className="flex flex-1 flex-col pt-2">
            <div className="h-px w-6 bg-vmm-ink" />
            <div className="mt-3 text-[10.5px] font-bold leading-tight tracking-[0.24em] text-vmm-ink">
              UI/UX DESIGNER
              <br />
              &amp; WEB DEVELOPER
            </div>
            <div className="mt-14 flex flex-col items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-vmm-ink text-white">
                <MousePointer2 className="h-4 w-4" />
              </div>
              <div className="text-[10.5px] font-bold leading-tight tracking-[0.24em] text-vmm-ink">
                SCROLL
                <br />
                DOWN
              </div>
            </div>
          </div>
        </div>

        {/* PERSON — anchored to bottom-right of red panel, extends UP into white section */}
        <div
          className="pointer-events-none absolute right-0 z-[2]"
          style={{
            bottom: 0,
            top: "-38%",
            width: "min(64vw, 380px)",
            marginRight: "-4vw",
          }}
        >
          <div className="vmm-glitch relative h-full w-full">
            <img
              src={heroPerson.url}
              alt="Portrait of Vence Michael Montero in a red and black jacket and bucket hat"
              className="vmm-glitch-base absolute inset-0 h-full w-full select-none object-contain object-bottom"
              draggable={false}
              fetchPriority="high"
            />
            <img
              src={heroPerson.url}
              aria-hidden
              alt=""
              className="vmm-glitch-r absolute inset-0 h-full w-full select-none object-contain object-bottom"
              draggable={false}
            />
            <img
              src={heroPerson.url}
              aria-hidden
              alt=""
              className="vmm-glitch-c absolute inset-0 h-full w-full select-none object-contain object-bottom"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}





