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

export function useGsap(
  fn: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void | (() => void),
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const api = ensureGsap();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ctx: gsap.Context | undefined;
    let featureCleanup: void | (() => void);

    const deactivate = () => {
      featureCleanup?.();
      featureCleanup = undefined;
      ctx?.revert();
      ctx = undefined;
    };
    const update = () => {
      deactivate();
      if (!media.matches) {
        ctx = gsap.context(() => {
          featureCleanup = fn(api);
        });
      }
    };

    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
