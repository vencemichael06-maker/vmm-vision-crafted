import { ArrowRight, Code2, LayoutTemplate, Smartphone, Workflow } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HandRevealFrameSequence } from "@/components/vmm/HandRevealFrameSequence";
import { progressToHandFrame } from "@/lib/vmm/handSequence";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";

const capabilities = [
  { label: "UI/UX Design", icon: LayoutTemplate },
  { label: "Web Development", icon: Code2 },
  { label: "AI Workflow Automation", icon: Workflow },
  { label: "Mobile App Development", icon: Smartphone },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useAboutProgress(sectionRef: React.RefObject<HTMLElement | null>, reducedMotion: boolean) {
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const raw = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const nextFrame = progressToHandFrame(raw);
      setProgress((current) =>
        progressToHandFrame(current) === nextFrame ? current : nextFrame / 47,
      );
    };
    const requestUpdate = () => {
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [reducedMotion, sectionRef]);

  return progress;
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const progress = useAboutProgress(sectionRef, reducedMotion);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About"
      className="vmm-section h-[150svh] md:h-[170svh] xl:h-[190svh]"
    >
      <div className="sticky top-0 min-h-[100svh] w-full overflow-hidden bg-white">
        <Orbs
          items={[
            { size: "s", top: "17%", left: "34%", opacity: 0.55 },
            { size: "m", top: "7%", right: "8%", opacity: 0.35 },
            { size: "s", bottom: "14%", left: "8%", opacity: 0.35 },
          ]}
        />

        <div className="vmm-container relative z-[2] grid min-h-[100svh] grid-cols-12 items-center pb-20 pt-24 md:pb-24 md:pt-28">
          <div className="col-span-8 z-[3] self-center pr-2 sm:col-span-7 md:col-span-5 lg:col-span-4 lg:col-start-2">
            <p className="vmm-kicker">ABOUT ME</p>
            <h2 className="mt-4 max-w-[8ch] font-display text-[clamp(2.65rem,11vw,5.8rem)] uppercase leading-[0.84]">
              I DESIGN<span className="text-vmm-red">.</span>
              <br />I BUILD<span className="text-vmm-red">.</span>
              <br />I SOLVE<span className="text-vmm-red">.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.55] text-vmm-ink/80 md:text-base">
              I&apos;m a UI/UX Designer and Frontend Developer who loves turning ideas into
              intuitive, functional, and visually stunning digital products.
            </p>

            <ul className="mt-6 grid gap-x-4 gap-y-3 sm:grid-cols-2" aria-label="Capabilities">
              {capabilities.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex min-h-11 items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.06em]"
                >
                  <Icon
                    className="h-5 w-5 shrink-0 text-vmm-red"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="vmm-button mt-6">
              LET&apos;S WORK TOGETHER <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-[-10%] top-[9%] z-[1] w-[68%] sm:right-0 sm:w-[61%] md:right-[3%] md:top-[4%] md:w-[58%] lg:right-[11%] lg:w-[48%]">
            <HandRevealFrameSequence progress={progress} reducedMotion={reducedMotion} />
          </div>

          <div className="absolute bottom-5 left-5 z-[4] flex items-end gap-3 md:hidden">
            <span className="font-display text-[3.5rem] font-black leading-none">002</span>
            <span className="mb-2 h-px w-8 bg-vmm-ink" aria-hidden="true" />
          </div>
          <PageNumber n="002" />
        </div>
      </div>
    </section>
  );
}
