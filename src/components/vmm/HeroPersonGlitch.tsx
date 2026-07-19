import { useEffect, useRef, useState } from "react";
import glitchVideo from "@/assets/vmm/hero_glitch_overlay.webm.asset.json";
import heroPerson from "@/assets/vmm/vmm_hero_person_tight.webp.asset.json";

const SESSION_KEY = "vmm-hero-glitch-played";
const VIDEO_SRC = glitchVideo.url;
const PERSON_SRC = heroPerson.url;

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Hero person = stable transparent WebP portrait (always present) with a
 * one-shot transparent WebM glitch overlay layered on top. The overlay
 * plays once per browser session, then unmounts, leaving the clean portrait.
 * Respects prefers-reduced-motion.
 */
export function HeroPersonGlitch({ className = "", style }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reduced || alreadyPlayed) {
      setShowOverlay(false);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShowOverlay(false);
    };
    v.addEventListener("ended", onEnded);
    v.play().catch(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShowOverlay(false);
    });
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`} style={style} aria-hidden="true">
      <img
        src={PERSON_SRC}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
      />
      {showOverlay && (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          autoPlay
          disablePictureInPicture
          className="absolute inset-0 h-full w-full select-none object-contain object-bottom mix-blend-screen"
          draggable={false}
        />
      )}
    </div>
  );
}
