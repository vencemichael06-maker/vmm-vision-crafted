export function LeftRail() {
  return (
    <div className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 md:block lg:left-6">
      <div className="vmm-vertical text-vmm-ink/70">UI/UX DESIGNER &nbsp;&amp;&nbsp; WEB DEVELOPER</div>
    </div>
  );
}

export function RightRail() {
  return (
    <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 md:block lg:right-6">
      <div className="vmm-vertical text-vmm-ink/70">
        BASED IN <span className="font-black text-vmm-ink">PHILIPPINES</span> &nbsp;•&nbsp; AVAILABLE FOR FREELANCE
      </div>
    </div>
  );
}

export function PageNumber({ n }: { n: string }) {
  return (
    <div className="pointer-events-none absolute bottom-6 left-4 hidden items-end gap-6 md:flex lg:left-8">
      <div className="font-display text-5xl leading-none">{n}</div>
      <div className="mb-2 h-px w-10 bg-vmm-ink/40" />
    </div>
  );
}
