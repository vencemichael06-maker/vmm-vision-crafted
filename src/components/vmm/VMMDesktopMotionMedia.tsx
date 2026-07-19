import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/vmm/page001/vmm-page001-hero-glitch.mp4.asset.json";
import heroPoster from "@/assets/vmm/page001/vmm-page001-hero-glitch-poster.jpg.asset.json";
import handVideo from "@/assets/vmm/page002/vmm-page002-hand-logo-exact-sync.mp4.asset.json";
import handPoster from "@/assets/vmm/page002/vmm-page002-hand-logo-exact-sync-poster.jpg.asset.json";

const DESKTOP_MQ = "(min-width: 1024px)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

type Props = { className?: string };

export function HeroGlitchMedia({ className = "" }: Props) {
  const isDesktop = useMediaQuery(DESKTOP_MQ);
  const reduced = useMediaQuery(REDUCED_MQ);
  if (!isDesktop) return null;

  if (reduced) {
    return (
      <div className={`vmm-motion-shell ${className}`.trim()} aria-hidden="true">
        <img className="vmm-motion-poster" src={heroPoster.url} alt="" />
      </div>
    );
  }

  return (
    <div className={`vmm-motion-shell ${className}`.trim()} aria-hidden="true">
      <video
        className="vmm-motion-video"
        src={heroVideo.url}
        poster={heroPoster.url}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
      />
    </div>
  );
}

type AboutProps = Props & { onRevealComplete?: () => void; threshold?: number };

export function AboutHandRevealMedia({
  className = "",
  onRevealComplete,
  threshold = 0.4,
}: AboutProps) {
  const isDesktop = useMediaQuery(DESKTOP_MQ);
  const reduced = useMediaQuery(REDUCED_MQ);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!isDesktop || reduced) return;
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        try {
          el.currentTime = 0;
          await el.play();
        } catch {
          /* autoplay blocked */
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isDesktop, reduced, threshold]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !onRevealComplete) return;
    const handler = () => onRevealComplete();
    el.addEventListener("ended", handler);
    return () => el.removeEventListener("ended", handler);
  }, [onRevealComplete]);

  if (!isDesktop) return null;

  if (reduced) {
    return (
      <div className={`vmm-motion-shell ${className}`.trim()} aria-hidden="true">
        <img className="vmm-motion-poster" src={handPoster.url} alt="" />
      </div>
    );
  }

  return (
    <div className={`vmm-motion-shell ${className}`.trim()}>
      <video
        ref={videoRef}
        className="vmm-motion-video"
        src={handVideo.url}
        poster={handPoster.url}
        playsInline
        preload="auto"
        controls={false}
      />
    </div>
  );
}
