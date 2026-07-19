import { RefObject, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 41;
const FRAME_URLS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/assets/vmm/hand-frames/hand_${String(i).padStart(2, "0")}.webp`,
);

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Page 002 hand + logo reveal driven by scroll.
 *
 * Uses the approved 41-frame GIF, decoded to a WebP sequence and painted onto
 * a canvas whose frame index is derived from the parent section's scroll
 * progress. Closed hand at scroll start → open hand + full logo arc at end.
 * Reverses 1:1 when scrolling back up. No autoplay, no timers.
 *
 * The frames are white-background with a black hand; the canvas is blended
 * into the Paper canvas with `mix-blend-mode: multiply` so the layer floats
 * cleanly without any rectangular boundary.
 */
export function HandRevealGif({ sectionRef, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const readyRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Preload frames.
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    FRAME_URLS.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        loaded += 1;
        if (!cancelled && loaded === FRAME_COUNT) {
          readyRef.current = true;
          draw(reducedMotion ? FRAME_COUNT - 1 : 0);
        }
      };
      imgs[i] = img;
    });
    framesRef.current = imgs;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = (idx: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;
    const img = frames[clamp(idx, 0, FRAME_COUNT - 1)];
    if (!img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // Fit contain, bottom-anchored.
    const ar = img.naturalWidth / img.naturalHeight;
    let dw = w;
    let dh = w / ar;
    if (dh > h) {
      dh = h;
      dw = h * ar;
    }
    const dx = (w - dw) / 2;
    const dy = h - dh;
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      draw(FRAME_COUNT - 1);
      return;
    }

    let raf = 0;
    let rendered = -1;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / scrollable, 0, 1);
      const idx = Math.round(progress * (FRAME_COUNT - 1));
      if (idx !== rendered && readyRef.current) {
        rendered = idx;
        draw(idx);
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const onResize = () => draw(rendered < 0 ? 0 : rendered);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [sectionRef, reducedMotion]);

  return (
    <div className={`hand-gif-layer ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="hand-gif-canvas" />
    </div>
  );
}
