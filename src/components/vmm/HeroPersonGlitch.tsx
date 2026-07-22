import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

const PERSON_SRC = "/assets/vmm/hero/hero-person-transparent-1264x2048.webp";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export function HeroPersonGlitch({ className = "", style }: Props) {
  const [phase, setPhase] = useState<"init" | "run" | "done">("init");
  const [pulse, setPulse] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement>(null);
  const id = useId().replace(/:/g, "");
  const redFilterId = `vmm-red-${id}`;
  const cyanFilterId = `vmm-cyan-${id}`;

  useEffect(() => {
    const image = baseImageRef.current;
    if (image?.complete && image.naturalWidth > 0) setImageReady(true);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }
    if (!imageReady) return;

    const animationFrame = window.requestAnimationFrame(() => setPhase("run"));
    const finishTimer = window.setTimeout(() => setPhase("done"), 950);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(finishTimer);
    };
  }, [imageReady]);

  useEffect(() => {
    if (phase !== "done" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let inViewport = false;
    let periodicTimer: number | undefined;
    let pulseTimer: number | undefined;

    const clearSchedule = () => {
      if (periodicTimer !== undefined) window.clearTimeout(periodicTimer);
      periodicTimer = undefined;
    };
    const schedule = () => {
      clearSchedule();
      if (!inViewport || document.hidden) return;
      periodicTimer = window.setTimeout(
        () => {
          periodicTimer = undefined;
          setPulse(true);
          pulseTimer = window.setTimeout(() => setPulse(false), 260);
          schedule();
        },
        10_000 + Math.random() * 4_000,
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = Boolean(entry?.isIntersecting);
        schedule();
      },
      { threshold: 0.2 },
    );
    if (rootRef.current) observer.observe(rootRef.current);
    document.addEventListener("visibilitychange", schedule);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      clearSchedule();
      if (pulseTimer) window.clearTimeout(pulseTimer);
    };
  }, [phase]);

  const imageClass =
    "vmm-hpg__img absolute inset-0 h-full w-full select-none object-contain object-bottom";

  return (
    <div
      ref={rootRef}
      className={`vmm-hpg vmm-hpg--${phase} ${pulse ? "vmm-hpg--pulse" : ""} relative h-full w-full ${className}`}
      style={style}
      aria-hidden="true"
      data-testid="hero-person"
    >
      <style>{`
        .vmm-hpg { --vmm-hpg-img: url(${PERSON_SRC}); }
        .vmm-hpg__img { -webkit-user-drag: none; user-select: none; }
        .vmm-hpg--init .vmm-hpg__base { opacity: 1; }
        .vmm-hpg--init .vmm-hpg__ghost, .vmm-hpg--init .vmm-hpg__r,
        .vmm-hpg--init .vmm-hpg__c, .vmm-hpg--init .vmm-hpg__slice { opacity: 0; }
        .vmm-hpg--done .vmm-hpg__base { opacity: 1; filter: none; transform: none; }
        .vmm-hpg--done .vmm-hpg__ghost, .vmm-hpg--done .vmm-hpg__r,
        .vmm-hpg--done .vmm-hpg__c, .vmm-hpg--done .vmm-hpg__slice { opacity: 0; }
        .vmm-hpg--run .vmm-hpg__base { animation: vmm-hpg-base 900ms steps(24, end) forwards; }
        .vmm-hpg--run .vmm-hpg__ghost { animation: vmm-hpg-ghost 900ms ease-out forwards; }
        .vmm-hpg--run .vmm-hpg__r { animation: vmm-hpg-rgb-r 900ms ease-out forwards; mix-blend-mode: screen; }
        .vmm-hpg--run .vmm-hpg__c { animation: vmm-hpg-rgb-c 900ms ease-out forwards; mix-blend-mode: screen; }
        .vmm-hpg--run .vmm-hpg__slice-1 { animation: vmm-hpg-s1 900ms steps(12, end) forwards; }
        .vmm-hpg--run .vmm-hpg__slice-2 { animation: vmm-hpg-s2 900ms steps(10, end) forwards; }
        .vmm-hpg--run .vmm-hpg__slice-3 { animation: vmm-hpg-s3 900ms steps(14, end) forwards; }
        .vmm-hpg__ghost { position: absolute; inset: 0; opacity: 0; background: var(--vmm-hpg-img) bottom center / contain no-repeat; filter: brightness(0) opacity(.55) blur(1px); }
        .vmm-hpg__r { filter: url(#${redFilterId}); }
        .vmm-hpg__c { filter: url(#${cyanFilterId}); }
        .vmm-hpg__r, .vmm-hpg__c { opacity: 0; }
        .vmm-hpg__slice { position: absolute; left: 0; right: 0; opacity: 0; background-image: var(--vmm-hpg-img); background-repeat: no-repeat; }
        .vmm-hpg__slice-1 { top: 24%; height: 6%; background-position: 0 24%; background-size: 100% 1600%; }
        .vmm-hpg__slice-2 { top: 48%; height: 4%; background-position: 0 48%; background-size: 100% 2400%; }
        .vmm-hpg__slice-3 { top: 70%; height: 5%; background-position: 0 70%; background-size: 100% 2000%; }
        .vmm-hpg--pulse .vmm-hpg__base { animation: vmm-hpg-pulse 260ms steps(6, end); }
        .vmm-hpg--pulse .vmm-hpg__ghost { animation: vmm-hpg-ghost 260ms ease-out forwards; }
        .vmm-hpg--pulse .vmm-hpg__r { animation: vmm-hpg-rgb-r 260ms ease-out forwards; mix-blend-mode: screen; }
        .vmm-hpg--pulse .vmm-hpg__c { animation: vmm-hpg-rgb-c 260ms ease-out forwards; mix-blend-mode: screen; }
        .vmm-hpg--pulse .vmm-hpg__slice-1 { animation: vmm-hpg-s1 260ms steps(6, end) forwards; }
        .vmm-hpg--pulse .vmm-hpg__slice-2 { animation: vmm-hpg-s2 260ms steps(6, end) forwards; }
        .vmm-hpg--pulse .vmm-hpg__slice-3 { animation: vmm-hpg-s3 260ms steps(6, end) forwards; }
        @keyframes vmm-hpg-base { 0%,100%{opacity:1;filter:none;transform:none} 28%{filter:contrast(1.12);transform:translateX(-2px)} 52%{transform:translateX(2px)} 72%{filter:contrast(1.04);transform:translateX(-1px)} }
        @keyframes vmm-hpg-ghost { 0%{opacity:0;transform:translateY(8px)} 25%{opacity:.9} 100%{opacity:0;transform:none} }
        @keyframes vmm-hpg-rgb-r { 0%,20%,100%{opacity:0;transform:none} 35%{opacity:.7;transform:translateX(-6px)} 65%{opacity:.35;transform:translateX(3px)} }
        @keyframes vmm-hpg-rgb-c { 0%,20%,100%{opacity:0;transform:none} 35%{opacity:.7;transform:translateX(6px)} 65%{opacity:.35;transform:translateX(-3px)} }
        @keyframes vmm-hpg-s1 { 0%,15%,100%{opacity:0;transform:none} 30%{opacity:.95;transform:translateX(-24px)} 55%{opacity:.6;transform:translateX(12px)} }
        @keyframes vmm-hpg-s2 { 0%,20%,100%{opacity:0;transform:none} 36%{opacity:.9;transform:translateX(28px)} 60%{opacity:.5;transform:translateX(-12px)} }
        @keyframes vmm-hpg-s3 { 0%,25%,100%{opacity:0;transform:none} 42%{opacity:.85;transform:translateX(-30px)} 64%{opacity:.4;transform:translateX(14px)} }
        @keyframes vmm-hpg-pulse { 0%,100%{transform:none;filter:none} 25%{transform:translateX(-3px);filter:contrast(1.15)} 50%{transform:translateX(3px)} }
        @media (prefers-reduced-motion: reduce) {
          .vmm-hpg .vmm-hpg__base { opacity:1!important; animation:none!important; filter:none!important; transform:none!important; }
          .vmm-hpg .vmm-hpg__ghost, .vmm-hpg .vmm-hpg__r, .vmm-hpg .vmm-hpg__c, .vmm-hpg .vmm-hpg__slice { display:none!important; }
        }
        @media (max-width: 767px) {
          .vmm-hpg__img { object-fit: cover; object-position: 48% bottom; }
          .vmm-hpg__ghost { background-size: cover; background-position: 48% bottom; }
        }
      `}</style>

      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={redFilterId}>
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
          </filter>
          <filter id={cyanFilterId}>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <img
        ref={baseImageRef}
        src={PERSON_SRC}
        alt=""
        decoding="async"
        fetchPriority="high"
        draggable={false}
        onLoad={() => setImageReady(true)}
        className={`${imageClass} vmm-hpg__base`}
      />
      {phase === "run" || pulse ? (
        <>
          <div className="vmm-hpg__ghost" />
          <img src={PERSON_SRC} alt="" draggable={false} className={`${imageClass} vmm-hpg__r`} />
          <img src={PERSON_SRC} alt="" draggable={false} className={`${imageClass} vmm-hpg__c`} />
          <div className="vmm-hpg__slice vmm-hpg__slice-1" />
          <div className="vmm-hpg__slice vmm-hpg__slice-2" />
          <div className="vmm-hpg__slice vmm-hpg__slice-3" />
        </>
      ) : null}
    </div>
  );
}
