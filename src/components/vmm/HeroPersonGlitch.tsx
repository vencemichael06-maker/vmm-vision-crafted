import { useEffect, useRef, useState } from "react";
import glitchVideo from "@/assets/vmm/hero_glitch_overlay.webm.asset.json";

const SESSION_KEY = "vmm-hero-glitch-played";
const VIDEO_SRC = glitchVideo.url;

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Hero person = transparent WebM (VP9 alpha) containing both the subject
 * and the baked-in glitch reveal. Plays once per browser session. When the
 * session has already played it, or the user prefers reduced motion, we hold
 * on the final frame instead of replaying.
 */
export function HeroPersonGlitch({ className = "", style }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [holdFinal, setHoldFinal] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";

    const holdOnLastFrame = () => {
      const seekEnd = () => {
        try {
          if (Number.isFinite(v.duration) && v.duration > 0) {
            v.currentTime = Math.max(0, v.duration - 0.05);
          }
        } catch {
          /* noop */
        }
        v.pause();
        setHoldFinal(true);
      };
      if (v.readyState >= 1) seekEnd();
      else v.addEventListener("loadedmetadata", seekEnd, { once: true });
    };

    if (reduced || alreadyPlayed) {
      holdOnLastFrame();
      return;
    }

    const onEnded = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setHoldFinal(true);
    };
    v.addEventListener("ended", onEnded);
    // Autoplay muted transparent video; if the browser blocks it, fall back
    // to the final frame so the person is still visible.
    v.play().catch(() => holdOnLastFrame());

    return () => {
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div
      className={`relative h-full w-full ${className}`}
      style={style}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        autoPlay={!holdFinal}
        disablePictureInPicture
        className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
        draggable={false}
      />
    </div>
  );
}
