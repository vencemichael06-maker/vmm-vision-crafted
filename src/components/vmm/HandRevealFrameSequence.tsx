import { RefObject, useEffect, useMemo, useRef, useState } from "react";

const FRAME_COUNT = 48;
const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 913;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
  onProgress?: (progress: number, frame: number) => void;
  /** >1 reveals logos earlier in scroll (default 1.0 = linear). */
  progressBias?: number;
};

export function HandRevealFrameSequence({ sectionRef, className = "", onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    if (!shouldLoad) return;
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
  }, [frameSources, shouldLoad]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !section || !ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const drawFrame = (i: number) => {
      const b = clamp(i, 0, FRAME_COUNT - 1);
      if (b === frameRef.current) return;
      const img = imagesRef.current[b];
      if (!img) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameRef.current = b;
    };

    const update = () => {
      rafRef.current = null;
      if (reducedMotion) {
        drawFrame(FRAME_COUNT - 1);
        onProgress?.(1, FRAME_COUNT - 1);
        return;
      }
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      const frame = Math.round(progress * (FRAME_COUNT - 1));
      drawFrame(frame);
      onProgress?.(progress, frame);
    };

    const request = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    drawFrame(reducedMotion ? FRAME_COUNT - 1 : 0);
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [ready, sectionRef, reducedMotion, onProgress]);

  return (
    <div className={`hand-reveal-media ${className}`} aria-hidden="true">
      {!ready && (
        <img
          className="hand-reveal-poster"
          src="/assets/vmm/about/hand-closed-transparent.png"
          alt=""
          decoding="async"
        />
      )}
      <canvas ref={canvasRef} className="hand-reveal-canvas" hidden={!ready} />
    </div>
  );
}
