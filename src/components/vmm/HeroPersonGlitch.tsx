import { useEffect, useState } from "react";
import heroPerson from "@/assets/vmm/vmm_hero_person_tight.webp.asset.json";

const SESSION_KEY = "vmm-hero-glitch-played";
const PERSON_SRC = heroPerson.url;

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Hero person = stable transparent portrait with a CSS-driven one-shot
 * glitch reveal (RGB split + horizontal slice + ease-out settle, ~900ms,
 * 5 phases per the motion direction board). Plays exactly once per browser
 * session; after that the clean portrait renders directly. Respects
 * prefers-reduced-motion (skips the glitch entirely).
 */
export function HeroPersonGlitch({ className = "", style }: Props) {
  const [playGlitch, setPlayGlitch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reduced || alreadyPlayed) return;
    setPlayGlitch(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  const imgClass =
    "absolute inset-0 h-full w-full select-none object-contain object-bottom";

  if (!playGlitch) {
    return (
      <div className={`relative h-full w-full ${className}`} style={style} aria-hidden="true">
        <img src={PERSON_SRC} alt="" draggable={false} className={imgClass} />
      </div>
    );
  }

  return (
    <div
      className={`vmm-glitch relative h-full w-full ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Cyan channel ghost */}
      <img src={PERSON_SRC} alt="" draggable={false} className={`vmm-glitch-c ${imgClass}`} />
      {/* Red channel ghost */}
      <img src={PERSON_SRC} alt="" draggable={false} className={`vmm-glitch-r ${imgClass}`} />
      {/* Base subject with clip-path slice reveal */}
      <img src={PERSON_SRC} alt="" draggable={false} className={`vmm-glitch-base ${imgClass}`} />
    </div>
  );
}
