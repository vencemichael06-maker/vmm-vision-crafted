import { useEffect, useState } from "react";
import heroAsset from "@/assets/vmm/hero_person_v4.webp.asset.json";

const PERSON_SRC = heroAsset.url;

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Page 001 hero figure with a one-time ~900ms premium glitch load-in.
 * Sequence: hidden → ghost silhouette → horizontal glitch slices →
 * RGB split / noise → clean final figure. Plays once per mount on load.
 * Respects prefers-reduced-motion.
 */
export function HeroPersonGlitch({ className = "", style }: Props) {
  const [phase, setPhase] = useState<"init" | "run" | "done">("init");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }
    // start on next frame so the "init" hidden state paints first
    const r = requestAnimationFrame(() => setPhase("run"));
    const t = window.setTimeout(() => setPhase("done"), 950);
    return () => {
      cancelAnimationFrame(r);
      window.clearTimeout(t);
    };
  }, []);

  // Controlled periodic pulse: short glitch burst every 6-9s, only while visible.
  useEffect(() => {
    if (phase !== "done") return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | null = null;
    let visible = true;
    const schedule = () => {
      const delay = 6000 + Math.random() * 3000;
      timer = window.setTimeout(() => {
        if (visible && !document.hidden) {
          setPulse(true);
          window.setTimeout(() => setPulse(false), 240);
        }
        schedule();
      }, delay);
    };

    // Only pulse while hero is in view
    const el = document.querySelector<HTMLElement>(".vmm-hpg");
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver(
        ([e]) => { visible = e.isIntersecting; },
        { threshold: 0.2 },
      );
      io.observe(el);
    }
    schedule();
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      io?.disconnect();
    };
  }, [phase]);


  const imgClass =
    "vmm-hpg__img absolute inset-0 h-full w-full select-none object-contain object-bottom";

  return (
    <div
      className={`vmm-hpg vmm-hpg--${phase} ${pulse ? "vmm-hpg--pulse" : ""} relative h-full w-full ${className}`}
      style={style}
      aria-hidden="true"
    >
      <style>{`
        .vmm-hpg { --vmm-hpg-img: url(${PERSON_SRC}); }
        .vmm-hpg__img { -webkit-user-drag: none; user-select: none; }

        /* Base image */
        .vmm-hpg .vmm-hpg__base { will-change: opacity, filter, transform; }

        /* Init: hidden */
        .vmm-hpg--init .vmm-hpg__base { opacity: 0; }
        .vmm-hpg--init .vmm-hpg__ghost,
        .vmm-hpg--init .vmm-hpg__r,
        .vmm-hpg--init .vmm-hpg__c,
        .vmm-hpg--init .vmm-hpg__slice { opacity: 0; }

        /* Done: clean stable figure, no filters, no overlays */
        .vmm-hpg--done .vmm-hpg__base { opacity: 1; filter: none; transform: none; }
        .vmm-hpg--done .vmm-hpg__ghost,
        .vmm-hpg--done .vmm-hpg__r,
        .vmm-hpg--done .vmm-hpg__c,
        .vmm-hpg--done .vmm-hpg__slice { display: none; }

        /* Run */
        .vmm-hpg--run .vmm-hpg__base {
          animation: vmm-hpg-base 900ms steps(24, end) forwards;
        }
        .vmm-hpg--run .vmm-hpg__ghost {
          animation: vmm-hpg-ghost 900ms ease-out forwards;
        }
        .vmm-hpg--run .vmm-hpg__r {
          animation: vmm-hpg-rgb-r 900ms ease-out forwards;
          mix-blend-mode: screen;
        }
        .vmm-hpg--run .vmm-hpg__c {
          animation: vmm-hpg-rgb-c 900ms ease-out forwards;
          mix-blend-mode: screen;
        }
        .vmm-hpg--run .vmm-hpg__slice-1 { animation: vmm-hpg-s1 900ms steps(12, end) forwards; }
        .vmm-hpg--run .vmm-hpg__slice-2 { animation: vmm-hpg-s2 900ms steps(10, end) forwards; }
        .vmm-hpg--run .vmm-hpg__slice-3 { animation: vmm-hpg-s3 900ms steps(14, end) forwards; }

        /* Ghost silhouette (uses same image, tinted flat via filter) */
        .vmm-hpg__ghost {
          position: absolute; inset: 0; width: 100%; height: 100%;
          background-image: var(--vmm-hpg-img);
          background-size: contain; background-position: bottom center; background-repeat: no-repeat;
          filter: brightness(0) invert(0) opacity(0.55) blur(1px);
          pointer-events: none;
        }

        /* RGB split copies */
        .vmm-hpg__r, .vmm-hpg__c {
          filter: none;
          pointer-events: none;
        }
        .vmm-hpg__r { filter: url(#vmm-hpg-red-only) drop-shadow(0 0 0 transparent); }
        .vmm-hpg__c { filter: url(#vmm-hpg-cyan-only); }

        /* Horizontal glitch slices (thin bands showing displaced image) */
        .vmm-hpg__slice {
          position: absolute; left: 0; right: 0;
          background-image: var(--vmm-hpg-img);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: 0 0;
          pointer-events: none;
          opacity: 0;
        }
        .vmm-hpg__slice-1 { top: 22%; height: 6%; background-position: 0 22%; background-size: 100% 1600%; }
        .vmm-hpg__slice-2 { top: 46%; height: 4%; background-position: 0 46%; background-size: 100% 2400%; }
        .vmm-hpg__slice-3 { top: 68%; height: 5%; background-position: 0 68%; background-size: 100% 2000%; }

        @keyframes vmm-hpg-base {
          0%   { opacity: 0; filter: contrast(1.4) brightness(0.6); transform: translate3d(0,0,0); }
          15%  { opacity: 0.35; filter: contrast(1.6) brightness(0.7); }
          35%  { opacity: 0.7; filter: contrast(1.3) brightness(0.9) hue-rotate(-8deg); transform: translate3d(2px,0,0); }
          55%  { opacity: 0.85; filter: contrast(1.15) brightness(1); transform: translate3d(-2px,0,0); }
          75%  { opacity: 1; filter: contrast(1.05) brightness(1); transform: translate3d(1px,0,0); }
          100% { opacity: 1; filter: none; transform: none; }
        }
        @keyframes vmm-hpg-ghost {
          0%   { opacity: 0; transform: translate3d(0,8px,0) scale(1.01); }
          20%  { opacity: 0.9; }
          60%  { opacity: 0.4; }
          100% { opacity: 0; transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes vmm-hpg-rgb-r {
          0%,20% { opacity: 0; transform: translate3d(0,0,0); }
          30%    { opacity: 0.7; transform: translate3d(-6px,0,0); }
          55%    { opacity: 0.55; transform: translate3d(4px,-1px,0); }
          80%    { opacity: 0.25; transform: translate3d(-2px,0,0); }
          100%   { opacity: 0; transform: none; }
        }
        @keyframes vmm-hpg-rgb-c {
          0%,20% { opacity: 0; transform: translate3d(0,0,0); }
          30%    { opacity: 0.7; transform: translate3d(6px,0,0); }
          55%    { opacity: 0.55; transform: translate3d(-4px,1px,0); }
          80%    { opacity: 0.25; transform: translate3d(2px,0,0); }
          100%   { opacity: 0; transform: none; }
        }
        @keyframes vmm-hpg-s1 {
          0%,15% { opacity: 0; transform: translate3d(0,0,0); }
          25%    { opacity: 0.95; transform: translate3d(-24px,0,0); }
          40%    { opacity: 0.8; transform: translate3d(18px,0,0); }
          60%    { opacity: 0.6; transform: translate3d(-10px,0,0); }
          80%    { opacity: 0.2; transform: translate3d(4px,0,0); }
          100%   { opacity: 0; transform: none; }
        }
        @keyframes vmm-hpg-s2 {
          0%,20% { opacity: 0; transform: translate3d(0,0,0); }
          32%    { opacity: 0.9; transform: translate3d(28px,0,0); }
          50%    { opacity: 0.7; transform: translate3d(-20px,0,0); }
          72%    { opacity: 0.4; transform: translate3d(8px,0,0); }
          100%   { opacity: 0; transform: none; }
        }
        @keyframes vmm-hpg-s3 {
          0%,25% { opacity: 0; transform: translate3d(0,0,0); }
          38%    { opacity: 0.85; transform: translate3d(-32px,0,0); }
          55%    { opacity: 0.65; transform: translate3d(22px,0,0); }
          78%    { opacity: 0.3; transform: translate3d(-6px,0,0); }
          100%   { opacity: 0; transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vmm-hpg .vmm-hpg__base { opacity: 1 !important; filter: none !important; transform: none !important; animation: none !important; }
          .vmm-hpg .vmm-hpg__ghost,
          .vmm-hpg .vmm-hpg__r,
          .vmm-hpg .vmm-hpg__c,
          .vmm-hpg .vmm-hpg__slice { display: none !important; }
        }
      `}</style>

      {/* Inline SVG filters for RGB split channels */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="vmm-hpg-red-only">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="vmm-hpg-cyan-only">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <img
        src={PERSON_SRC}
        alt=""
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={`${imgClass} vmm-hpg__base`}
      />
      {phase === "run" && (
        <>
          <div className="vmm-hpg__ghost" />
          <img src={PERSON_SRC} alt="" aria-hidden draggable={false} className={`${imgClass} vmm-hpg__r`} />
          <img src={PERSON_SRC} alt="" aria-hidden draggable={false} className={`${imgClass} vmm-hpg__c`} />
          <div className="vmm-hpg__slice vmm-hpg__slice-1" />
          <div className="vmm-hpg__slice vmm-hpg__slice-2" />
          <div className="vmm-hpg__slice vmm-hpg__slice-3" />
        </>
      )}
    </div>
  );
}
