import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { ensureGsap } from "@/lib/vmm/useGsap";

const FRAME_COUNT = 62;
const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 960;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

type Props = {
  /** Outer section to pin — must be the desktop-only wrapper. */
  pinRef: RefObject<HTMLElement | null>;
  /** end value for ScrollTrigger, e.g. "+=220%" */
  end?: string;
};

/**
 * Desktop Page 002 hand reveal.
 * - GSAP ScrollTrigger pin + scrub (no autoplay, no timeout, no video.play()).
 * - Preloads all 48 WebP frames before enabling the scrub.
 * - Renders the first frame while loading; no JPG poster flash.
 * - Frame WebPs are opaque (white bg baked-in): we key the white out with
 *   `mix-blend-mode: multiply` against the Paper canvas so no rectangle shows.
 */
export function HandRevealDesktop({ pinRef, end = "+=220%" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(-1);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const frameSources = useMemo(
    () =>
      Array.from(
        { length: FRAME_COUNT },
        (_, i) => `/assets/vmm/about/hand-frames/hand_${String(i).padStart(2, "0")}.webp`,
      ),
    [],
  );

  // Preload all frames before the scrub becomes interactive.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      frameSources.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          }),
      ),
    )
      .then((images) => {
        if (cancelled) return;
        imagesRef.current = images;
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
    };
  }, [frameSources]);

  // Draw frame 0 as soon as it's available so nothing "advances".
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const first = imagesRef.current[reducedMotion ? FRAME_COUNT - 1 : 0];
    if (first) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(first, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameRef.current = reducedMotion ? FRAME_COUNT - 1 : 0;
    }
  }, [ready, reducedMotion]);

  // Bind ScrollTrigger only after frames are decoded and only on desktop.
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) return;
    const pinEl = pinRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!pinEl || !canvas || !ctx) return;

    const mm = window.matchMedia("(min-width: 1024px)");
    if (!mm.matches) return; // desktop-only

    const { gsap, ScrollTrigger } = ensureGsap();

    const drawFrame = (i: number) => {
      const b = clamp(i, 0, FRAME_COUNT - 1);
      if (b === frameRef.current) return;
      const img = imagesRef.current[b];
      if (!img) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameRef.current = b;
    };

    const st = ScrollTrigger.create({
      trigger: pinEl,
      start: "top top",
      end,
      pin: true,
      pinSpacing: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = clamp(self.progress, 0, 1);
        const frame = Math.floor(progress * (FRAME_COUNT - 1));
        drawFrame(frame);
      },
    });

    // Force a refresh so ScrollTrigger picks up post-mount layout.
    ScrollTrigger.refresh();

    return () => {
      st.kill();
      // Keep gsap tree clean if this component remounts.
      gsap.set(pinEl, { clearProps: "all" });
    };
  }, [ready, reducedMotion, pinRef, end]);

  return (
    <div className="page002-hand-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="page002-hand-canvas" />
    </div>
  );
}
