import { useEffect, useRef, useState } from "react";
import {
  frameIndexFromProgress,
  normalizedScrollProgress,
} from "@/lib/vmm/handScrollMath";
import manifest from "@/lib/vmm/handFrameUrls.json";

const FRAME_URLS: string[] = manifest.urls;
const FRAME_COUNT = manifest.frameCount;
const SOURCE_WIDTH = manifest.width;
const SOURCE_HEIGHT = manifest.height;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`frame load failed: ${src}`));
    image.src = src;
  });
}

/**
 * Desktop-only (>=1024px) scroll-scrubbed hand + logo reveal.
 * - PNG frame sequence rendered through <canvas> (real RGBA transparency).
 * - Progress derived from the ancestor [data-vmm-page002-track] scroll position.
 * - Reversible; never autoplays.
 * - prefers-reduced-motion: shows the final frame without pinning behavior.
 */
export function DesktopHandScrollReveal({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const scheduledRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = canvasRef.current;
    if (!canvas || !desktopQuery.matches) return;

    const track = canvas.closest<HTMLElement>("[data-vmm-page002-track]");
    if (!track) {
      setStatus("error");
      console.error("DesktopHandScrollReveal: missing [data-vmm-page002-track] ancestor");
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      setStatus("error");
      return;
    }
    canvas.width = SOURCE_WIDTH;
    canvas.height = SOURCE_HEIGHT;

    let cancelled = false;

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || index === lastFrameRef.current) return;
      ctx.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
      ctx.drawImage(img, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
      lastFrameRef.current = index;
    };

    const update = () => {
      scheduledRef.current = null;
      if (!imagesRef.current.length) return;
      if (reducedMotionQuery.matches) {
        drawFrame(FRAME_COUNT - 1);
        return;
      }
      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      const progress = normalizedScrollProgress(rect.top, scrollable);
      drawFrame(frameIndexFromProgress(progress, FRAME_COUNT));
    };

    const schedule = () => {
      if (scheduledRef.current !== null) return;
      scheduledRef.current = window.requestAnimationFrame(update);
    };

    const preload = async () => {
      try {
        const first = await loadImage(FRAME_URLS[0]);
        if (cancelled) return;
        imagesRef.current[0] = first;
        drawFrame(0);

        const rest = await Promise.all(
          FRAME_URLS.slice(1).map((u) => loadImage(u)),
        );
        if (cancelled) return;
        rest.forEach((img, i) => (imagesRef.current[i + 1] = img));
        setStatus("ready");
        update();
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          console.error(e);
        }
      }
    };

    void preload();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (scheduledRef.current !== null) window.cancelAnimationFrame(scheduledRef.current);
      imagesRef.current = [];
    };
  }, []);

  return (
    <div
      className={`vmm-hand-scroll-stage ${className}`.trim()}
      data-status={status}
      aria-busy={status === "loading"}
    >
      <canvas
        ref={canvasRef}
        className="vmm-hand-scroll-canvas"
        aria-label="Black-gloved hand opening while development tool logos reveal"
        role="img"
      />
    </div>
  );
}
