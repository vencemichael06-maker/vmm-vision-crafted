import { useEffect, type DependencyList } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function ensureGsap() {
  if (typeof window === "undefined") return { gsap, ScrollTrigger };
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export function useGsap(fn: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void | (() => void), deps: DependencyList = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const api = ensureGsap();
    const ctx = gsap.context(() => {
      const cleanup = fn(api);
      return cleanup;
    });
    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
