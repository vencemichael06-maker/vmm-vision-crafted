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
      <section ref={heroRef} className="relative min-h-[100svh] w-full overflow-hidden pt-28 md:pt-32">
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.slice(0, 4).map((p) => (
              <Link
                key={p.slug}
                to="/work/$slug"
                params={{ slug: p.slug }}
                data-reveal
                className="group relative block overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)] transition hover:-translate-y-1"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-vmm-ink">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.24em] text-vmm-red">{p.category}</p>
                    <h3 className="mt-2 font-display text-xl md:text-2xl">{p.title}</h3>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-vmm-red text-white transition-transform group-hover:rotate-[-8deg]">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeToolsStrip />
      <HomeFooter />
    </div>
  );
}
