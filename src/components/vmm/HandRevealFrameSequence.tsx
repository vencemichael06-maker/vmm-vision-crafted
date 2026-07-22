import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { HAND_FRAME_COUNT, progressToHandFrame } from "@/lib/vmm/handSequence";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 913;

type Props = {
  progress?: number;
  reducedMotion?: boolean;
  className?: string;
  onFrame?: (frame: number) => void;
  sectionRef?: RefObject<HTMLElement | null>;
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function HandRevealFrameSequence({
  progress = 0,
  reducedMotion: reducedMotionProp,
  className = "",
  onFrame,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>(Array(HAND_FRAME_COUNT));
  const promisesRef = useRef<Array<Promise<HTMLImageElement> | undefined>>(Array(HAND_FRAME_COUNT));
  const frameRef = useRef(-1);
  const [nearViewport, setNearViewport] = useState(false);
  const [decodedCount, setDecodedCount] = useState(0);
  const [mediaReducedMotion, setMediaReducedMotion] = useState(false);
  const reducedMotion = reducedMotionProp ?? mediaReducedMotion;

  const frameSources = useMemo(
    () =>
      Array.from(
        { length: HAND_FRAME_COUNT },
        (_, index) => `/assets/vmm/about/hand-frames/hand_${String(index).padStart(2, "0")}.webp`,
      ),
    [],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMediaReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const loadFrame = useCallback(
    (index: number) => {
      const safeIndex = Math.min(Math.max(index, 0), HAND_FRAME_COUNT - 1);
      const cached = imagesRef.current[safeIndex];
      if (cached) return Promise.resolve(cached);
      const pending = promisesRef.current[safeIndex];
      if (pending) return pending;

      const request = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = async () => {
          try {
            await image.decode();
          } catch {
            // onload is sufficient when decode() is unavailable or already complete.
          }
          imagesRef.current[safeIndex] = image;
          setDecodedCount((count) => count + 1);
          resolve(image);
        };
        image.onerror = () => reject(new Error(`Unable to load hand frame ${safeIndex}`));
        image.src = frameSources[safeIndex];
      });
      promisesRef.current[safeIndex] = request;
      return request;
    },
    [frameSources],
  );

  const drawFrame = useCallback(
    (requestedFrame: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d", { alpha: true });
      if (!canvas || !context) return;
      const exact = imagesRef.current[requestedFrame];
      const fallback =
        exact ??
        imagesRef.current.reduce<{ image?: HTMLImageElement; distance: number }>(
          (best, image, index) => {
            const distance = Math.abs(index - requestedFrame);
            return image && distance < best.distance ? { image, distance } : best;
          },
          { distance: Number.POSITIVE_INFINITY },
        ).image;
      if (!fallback) return;

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.drawImage(fallback, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameRef.current = requestedFrame;
      if (rootRef.current) rootRef.current.dataset.currentFrame = String(requestedFrame);
      onFrame?.(requestedFrame);
    },
    [onFrame],
  );

  useEffect(() => {
    if (!nearViewport || reducedMotion) return;
    let cancelled = false;
    let idleHandle: number | undefined;
    const target = progressToHandFrame(progress);
    const priority = Array.from(
      new Set(
        [0, HAND_FRAME_COUNT - 1, target, target - 1, target + 1, target - 2, target + 2].filter(
          (index) => index >= 0 && index < HAND_FRAME_COUNT,
        ),
      ),
    );

    void Promise.all(priority.map((index) => loadFrame(index).catch(() => undefined))).then(() => {
      if (cancelled) return;
      drawFrame(target);
      const remaining = Array.from({ length: HAND_FRAME_COUNT }, (_, index) => index).filter(
        (index) => !priority.includes(index),
      );
      let cursor = 0;
      const loadBatch = () => {
        if (cancelled || cursor >= remaining.length) return;
        const batch = remaining.slice(cursor, cursor + 8);
        cursor += batch.length;
        void Promise.all(batch.map((index) => loadFrame(index).catch(() => undefined))).then(() => {
          if (cancelled) return;
          const idleWindow = window as IdleWindow;
          idleHandle = idleWindow.requestIdleCallback
            ? idleWindow.requestIdleCallback(loadBatch, { timeout: 750 })
            : window.setTimeout(loadBatch, 80);
        });
      };
      loadBatch();
    });

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) {
        const idleWindow = window as IdleWindow;
        if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
      }
    };
  }, [drawFrame, loadFrame, nearViewport, progress, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !nearViewport) return;
    const target = progressToHandFrame(progress);
    if (target === frameRef.current) return;
    void loadFrame(target)
      .then(() => drawFrame(target))
      .catch(() => drawFrame(target));
  }, [drawFrame, loadFrame, nearViewport, progress, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        ref={rootRef}
        className={`hand-reveal-media ${className}`}
        aria-hidden="true"
        data-reduced-motion="true"
        data-current-frame="47"
      >
        <img
          className="hand-reveal-poster"
          src="/assets/vmm/about/hand-open-transparent.png"
          alt=""
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`hand-reveal-media ${className}`}
      aria-hidden="true"
      data-current-frame={frameRef.current < 0 ? 0 : frameRef.current}
    >
      {decodedCount === 0 ? (
        <img
          className="hand-reveal-poster"
          src="/assets/vmm/about/hand-closed-transparent.png"
          alt=""
          decoding="async"
        />
      ) : null}
      <canvas
        ref={canvasRef}
        className="hand-reveal-canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        hidden={decodedCount === 0}
      />
    </div>
  );
}
