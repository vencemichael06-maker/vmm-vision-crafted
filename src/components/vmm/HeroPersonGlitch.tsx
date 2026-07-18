import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "vmm-hero-glitch-played";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function HeroPersonGlitch({ className = "", style }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reduced || alreadyPlayed) {
      setFinished(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    const start = () => {
      video.currentTime = 0;
      video.play().catch(() => setFinished(true));
    };
    if (video.readyState >= 3) start();
    else video.addEventListener("canplay", start, { once: true });
    return () => video.removeEventListener("canplay", start);
  }, []);

  const complete = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setFinished(true);
  };

  return (
    <div className={`relative h-full w-full ${className}`} style={style} aria-hidden="true">
      <img
        src="/assets/vmm/hero/hero-person-transparent-1264x2048.webp"
        alt=""
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
      />
      {!finished && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          controls={false}
          poster="/assets/vmm/hero/hero-glitch-poster.webp"
          onEnded={complete}
          onError={() => setFinished(true)}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-bottom mix-blend-normal"
        >
          <source src="/assets/vmm/hero/hero-glitch-overlay-transparent.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
