import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";

const links = [
  { hash: "home", label: "HOME" },
  { hash: "about", label: "ABOUT" },
  { hash: "work", label: "WORK" },
  { hash: "services", label: "SERVICES" },
  { hash: "contact", label: "CONTACT" },
] as const;

function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (!el) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${hash}`);
}

function useActiveSection(): string {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    const ids = links.map((l) => l.hash);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const active = useActiveSection();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!onHome) return; // Let it navigate to / then browser handles hash
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-vmm-canvas/80 backdrop-blur-sm">
        <div className="relative flex w-full items-center justify-between px-5 py-5 md:px-6 md:py-6 lg:px-8 xl:px-10">
          <a
            href={onHome ? "#home" : "/#home"}
            onClick={(e) => onHome && (e.preventDefault(), scrollToHash("home"))}
            aria-label="Home"
          >
            <Wordmark />
          </a>

          <nav className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:flex xl:gap-14">
            {links.map((l) => {
              const isActive = onHome && active === l.hash;
              return (
                <a
                  key={l.hash}
                  href={onHome ? `#${l.hash}` : `/#${l.hash}`}
                  onClick={(e) => handleAnchorClick(e, l.hash)}
                  data-active={isActive ? "true" : "false"}
                  className="vmm-nav-link pointer-events-auto text-[13px] font-bold tracking-[0.22em] text-vmm-ink/80 hover:text-vmm-red"
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href={onHome ? "#contact" : "/#contact"}
              onClick={(e) => handleAnchorClick(e, "contact")}
              className="hidden items-center gap-3 rounded-md bg-vmm-ink px-5 py-3 text-[12px] font-bold tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              LET'S TALK <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center text-vmm-ink"
            >
              <Menu className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <MobileMenu
          onClose={() => setOpen(false)}
          onNavigate={(hash) => {
            setOpen(false);
            if (onHome) requestAnimationFrame(() => scrollToHash(hash));
            else window.location.href = `/#${hash}`;
          }}
        />
      )}
    </>
  );
}

function MobileMenu({ onClose, onNavigate }: { onClose: () => void; onNavigate: (hash: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-vmm-ink/60 p-3 md:p-6" role="dialog" aria-modal>
      <div className="relative mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-2xl bg-vmm-canvas">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <Wordmark />
          <button type="button" aria-label="Close menu" onClick={onClose} className="grid h-11 w-11 place-items-center text-vmm-ink">
            <X className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-3 px-6 md:gap-4 md:px-14">
          {links.map((l, i) => (
            <button
              key={l.hash}
              type="button"
              onClick={() => onNavigate(l.hash)}
              className="group flex items-baseline text-left"
            >
              <span className="font-display text-6xl leading-[0.9] tracking-tight text-vmm-ink transition-colors group-hover:text-vmm-red md:text-8xl">
                {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
              </span>
              <span className="text-vmm-red">{i === 0 ? "." : ""}</span>
            </button>
          ))}

          <div className="mt-10">
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-3 rounded-md bg-vmm-ink px-6 py-4 text-[12px] font-bold tracking-[0.18em] text-white"
            >
              LET'S TALK <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </nav>

        <div className="flex items-end justify-between gap-4 border-t border-vmm-line px-6 py-6 text-[11px] font-bold tracking-[0.18em] md:px-14">
          <div className="leading-relaxed">UI/UX DESIGNER<br />&amp; WEB DEVELOPER</div>
          <div className="hidden text-right leading-relaxed md:block">BASED IN<br /><span className="text-vmm-ink">PHILIPPINES</span></div>
          <div className="flex items-center gap-2 text-vmm-ink">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-vmm-ink text-[11px] font-black text-white">Bē</Link>
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-vmm-ink text-[11px] font-black text-white">in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
