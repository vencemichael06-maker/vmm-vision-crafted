import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";

const links = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
  { to: "/work", label: "WORK" },
  { to: "/services", label: "SERVICES" },
  { to: "/contact", label: "CONTACT" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between px-5 py-5 md:px-8 md:py-6 lg:px-12">
          <Wordmark />

          <nav className="hidden items-center gap-10 lg:flex">
            {links.map((l) => {
              const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative text-[13px] font-bold tracking-[0.18em] text-vmm-ink transition-colors hover:text-vmm-red"
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-vmm-red" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/contact"
              className="hidden items-center gap-3 rounded-md bg-vmm-ink px-5 py-3 text-[12px] font-bold tracking-[0.18em] text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              LET'S TALK <ArrowRight className="h-4 w-4" />
            </Link>
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

      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-vmm-ink/60 p-3 md:p-6" role="dialog" aria-modal>
      <div className="relative mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-2xl bg-vmm-canvas">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <Wordmark />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center text-vmm-ink"
          >
            <X className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-3 px-6 md:gap-4 md:px-14">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="group flex items-baseline"
            >
              <span className="font-display text-6xl leading-[0.9] tracking-tight text-vmm-ink transition-colors group-hover:text-vmm-red md:text-8xl">
                {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
              </span>
              <span className="text-vmm-red">{i === 0 ? "." : ""}</span>
            </Link>
          ))}

          <div className="mt-10">
            <Link
              to="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-3 rounded-md bg-vmm-ink px-6 py-4 text-[12px] font-bold tracking-[0.18em] text-white"
            >
              LET'S TALK <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        <div className="flex items-end justify-between gap-4 border-t border-vmm-line px-6 py-6 text-[11px] font-bold tracking-[0.18em] md:px-14">
          <div className="leading-relaxed">
            UI/UX DESIGNER
            <br />
            &amp; WEB DEVELOPER
          </div>
          <div className="hidden text-right leading-relaxed md:block">
            BASED IN
            <br />
            <span className="text-vmm-ink">PHILIPPINES</span>
          </div>
          <div className="flex items-center gap-2 text-vmm-ink">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-vmm-ink text-[11px] font-black text-white">
              Bē
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-vmm-ink text-[11px] font-black text-white">
              in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
