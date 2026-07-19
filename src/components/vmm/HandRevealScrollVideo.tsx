import { RefObject, useEffect, useRef, useState } from "react";
import webmAsset from "@/assets/vmm/hand_reveal_scrub.webm.asset.json";
import mp4Asset from "@/assets/vmm/hand_reveal_scrub.mp4.asset.json";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type Props = {
  /** Section that owns the scroll distance (sticky container's parent). */
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Scroll-scrubbed hand + logo reveal video.
 *
 * - Primary: transparent VP9 WebM (floats over the Paper canvas — no wrapper box).
 * - Fallback: H.264 MP4 with #F7F7F5 background matting into the page.
 * - Never autoplayed; `video.currentTime` is driven from the parent section's
 *   scroll progress via requestAnimationFrame with light damping.
 */
export function HandRevealScrollVideo({ sectionRef, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    if (reducedMotion) {
      const seekEnd = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.max(0, video.duration - 0.001);
        }
      };
      if (video.readyState >= 1) seekEnd();
      else video.addEventListener("loadedmetadata", seekEnd, { once: true });
      return () => video.removeEventListener("loadedmetadata", seekEnd);
    }

    let raf = 0;
    let rendered = 0;

    // Keyframe mapping (from reference sheet, seconds):
    //   0.00 closed · 0.30 first logo · 0.46–0.58 logos build (hand still closed)
    //   0.74 hand starts opening · 0.90–1.06 mid-open · 1.16 near full arc
    //   1.22 fully open + full arc · 1.80 hold
    // Maps scroll progress → timeline seconds so logos appear early and the
    // hand opening occupies the middle-to-late scroll band.
    const KEY_P = [0.00, 0.10, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.90, 1.00];
    const KEY_T = [0.00, 0.16, 0.30, 0.46, 0.58, 0.74, 0.90, 1.06, 1.22, 1.80];

    const mapProgressToTime = (p: number, duration: number) => {
      const c = clamp(p, 0, 1);
      let i = 1;
      while (i < KEY_P.length - 1 && c > KEY_P[i]) i++;
      const local = (c - KEY_P[i - 1]) / Math.max(1e-6, KEY_P[i] - KEY_P[i - 1]);
      const seconds = KEY_T[i - 1] + local * (KEY_T[i] - KEY_T[i - 1]);
      return clamp(seconds, 0, Math.max(0, duration - 0.001));
    };

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const target = clamp(-rect.top / scrollable, 0, 1);

      // Light damping smooths jitter without decoupling from scroll.
      rendered += (target - rendered) * 0.2;

      if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
        const t = mapProgressToTime(rendered, video.duration);
        if (Math.abs(video.currentTime - t) > 1 / 120) video.currentTime = t;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [sectionRef, reducedMotion]);

  return (
    <div className={`hand-scrub-layer ${className}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="hand-scrub-video"
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        // No poster: keeps wrapper visually transparent while WebM decodes.
      >
        <source src={webmAsset.url} type="video/webm" />
        <source src={mp4Asset.url} type="video/mp4" />
      </video>
    </div>
  );
}
