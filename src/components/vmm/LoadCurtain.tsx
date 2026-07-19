import { useEffect, useState } from "react";

const KEY = "vmm-load-curtain-played";

export function LoadCurtain() {
  const [mounted, setMounted] = useState(false);
  const [gone, setGone] = useState(false);
  const [lift, setLift] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played = sessionStorage.getItem(KEY) === "1";
    if (reduced || played) return;
    sessionStorage.setItem(KEY, "1");
    setMounted(true);
    const t1 = window.setTimeout(() => setLift(true), 650);
    const t2 = window.setTimeout(() => setGone(true), 1550);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!mounted || gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <div
        className="absolute inset-0 flex items-center justify-center bg-vmm-ink text-vmm-canvas"
        style={{
          transform: lift ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 900ms cubic-bezier(0.86, 0, 0.07, 1)",
        }}
      >
        <div className="flex items-baseline gap-1 font-display text-6xl font-black md:text-8xl">
          <span style={{ animation: "vmm-curtain-fade 700ms ease-out both" }}>vmm</span>
          <span className="text-vmm-red" style={{ animation: "vmm-curtain-fade 700ms 120ms ease-out both" }}>.</span>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-vmm-red"
        style={{
          transform: lift ? "translateY(-100%)" : "translateY(100%)",
          transition: "transform 900ms 120ms cubic-bezier(0.86, 0, 0.07, 1)",
        }}
      />
    </div>
  );
}
