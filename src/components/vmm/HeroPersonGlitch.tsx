import { useEffect, useState } from "react";

const SESSION_KEY = "vmm-hero-glitch-played";
import heroPersonV4 from "@/assets/vmm/hero_person_v4.png.asset.json";
const PERSON_SRC = heroPersonV4.url;

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function HeroPersonGlitch({ className = "", style }: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reduced || alreadyPlayed) return;
    setAnimate(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = window.setTimeout(() => setAnimate(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  const imgClass =
    "absolute inset-0 h-full w-full select-none object-contain object-bottom";

  return (
    <div
      className={`relative h-full w-full ${animate ? "vmm-glitch" : ""} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <img
        src={PERSON_SRC}
        alt=""
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={`${imgClass} vmm-glitch-base`}
      />
      {animate && (
        <>
          <img src={PERSON_SRC} alt="" aria-hidden draggable={false} className={`${imgClass} vmm-glitch-r`} />
          <img src={PERSON_SRC} alt="" aria-hidden draggable={false} className={`${imgClass} vmm-glitch-c`} />
        </>
      )}
    </div>
  );
}
