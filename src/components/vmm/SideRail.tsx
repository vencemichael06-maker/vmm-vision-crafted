export function LeftRail() {
  return (
    <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 md:block lg:left-6 xl:left-8">
      <div
        className="font-bold uppercase text-vmm-ink"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          letterSpacing: "0.42em",
          fontSize: "11px",
        }}
      >
        UI/UX DESIGNER &nbsp;&amp;&nbsp; WEB DEVELOPER
      </div>
    </div>
  );
}

export function RightRail() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 z-[6] hidden -translate-y-1/2 md:block lg:right-6 xl:right-8">
      <div
        className="flex flex-col items-center gap-3 font-bold uppercase text-vmm-ink"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <span style={{ fontSize: "11px", letterSpacing: "0.38em" }} className="opacity-90">
          BASED IN
        </span>
        <span className="font-black" style={{ fontSize: "16px", letterSpacing: "0.22em" }}>
          PHILIPPINES
        </span>
        <span style={{ fontSize: "11px", letterSpacing: "0.38em" }} className="opacity-90">
          AVAILABLE FOR FREELANCE
        </span>
      </div>
    </div>
  );
}

export function PageNumber({ n, tone = "dark" }: { n: string; tone?: "dark" | "light" }) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-6 z-[6] hidden items-end gap-4 md:flex lg:left-8 xl:left-10">
      <div
        className={`font-display font-black leading-[0.82] ${tone === "light" ? "text-white" : "text-vmm-ink"}`}
        style={{
          fontSize: "clamp(64px, 6.2vw, 104px)",
          letterSpacing: "-0.02em",
        }}
      >
        {n}
      </div>
      <div className={`mb-3 h-px w-10 ${tone === "light" ? "bg-white/60" : "bg-vmm-ink/60"}`} />
    </div>
  );
}
