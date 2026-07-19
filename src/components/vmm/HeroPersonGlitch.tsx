import { useEffect, useRef, useState } from "react";
import heroPerson from "@/assets/vmm/hero_person_clean.png.asset.json";
import glitchOverlay from "@/assets/vmm/hero_glitch_overlay.webm.asset.json";

const SESSION_KEY = "vmm-hero-glitch-played";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Hero person = clean transparent portrait with a transparent WebM glitch
 * overlay played exactly once per browser session (or hard refresh). After
 * the first play the overlay is skipped and only the stable portrait shows.
 * Respects prefers-reduced-motion (skips the overlay entirely).
 */
export function HeroPersonGlitch({ className = "", style }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    setShowOverlay(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useEffect(() => {
    if (!showOverlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onEnded = () => setShowOverlay(false);
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [showOverlay]);

  return (
    <div className={`relative h-full w-full ${className}`} style={style} aria-hidden="true">
      <img
        src={heroPerson.url}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
      />
      {showOverlay && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-bottom mix-blend-screen"
        >
          <source src={glitchOverlay.url} type="video/webm" />
        </video>
      )}
    </div>
  );
}
