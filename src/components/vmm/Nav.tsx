import * as Dialog from "@radix-ui/react-dialog";
import { useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { contactConfig } from "@/lib/vmm/contact-config";
import { SocialLinks } from "./SocialLinks";
import { Wordmark } from "./Wordmark";

const links = [
  { hash: "home", label: "HOME" },
  { hash: "about", label: "ABOUT" },
  { hash: "work", label: "WORK" },
  { hash: "services", label: "SERVICES" },
  { hash: "contact", label: "CONTACT" },
] as const;

function scrollToHash(hash: string, updateHistory = true) {
  const target = document.getElementById(hash);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (updateHistory && window.location.hash !== `#${hash}`) {
    window.history.pushState({ vmmSection: hash }, "", `#${hash}`);
  }
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function useActiveSection(onHome: boolean) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (!onHome) return;
    setActive(window.location.hash.slice(1) || "home");
    const targets = links
      .map(({ hash }) => document.getElementById(hash))
      .filter((target): target is HTMLElement => Boolean(target));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-34% 0px -55%", threshold: [0, 0.2, 0.5, 0.8] },
    );
    targets.forEach((target) => observer.observe(target));

    const restoreFromHistory = () => {
      const hash = window.location.hash.slice(1) || "home";
      setActive(hash);
      window.requestAnimationFrame(() => scrollToHash(hash, false));
    };
    window.addEventListener("popstate", restoreFromHistory);
    window.addEventListener("hashchange", restoreFromHistory);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", restoreFromHistory);
      window.removeEventListener("hashchange", restoreFromHistory);
    };
  }, [onHome]);

  return active;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!onHome) return;
    event.preventDefault();
    setOpen(false);
    window.requestAnimationFrame(() => scrollToHash(hash));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-white/92 backdrop-blur-md">
        <div className="vmm-container relative flex min-h-[76px] items-center justify-between">
          <a
            href={onHome ? "#home" : "/#home"}
            onClick={(event) => handleAnchorClick(event, "home")}
            aria-label="Home"
            className="inline-flex min-h-11 items-center"
          >
            <Wordmark />
          </a>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 md:flex lg:gap-7 xl:gap-11"
          >
            {links.map((link) => {
              const current = onHome && active === link.hash;
              return (
                <a
                  key={link.hash}
                  href={onHome ? `#${link.hash}` : `/#${link.hash}`}
                  onClick={(event) => handleAnchorClick(event, link.hash)}
                  aria-current={current ? "location" : undefined}
                  className={`vmm-nav-link text-[11px] font-extrabold tracking-[0.22em] text-vmm-ink hover:text-vmm-red xl:text-xs ${link.hash === "about" || link.hash === "services" ? "!hidden min-[900px]:!inline-flex" : ""}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={onHome ? "#contact" : "/#contact"}
              onClick={(event) => handleAnchorClick(event, "contact")}
              className="vmm-button !hidden min-h-11 px-5 py-2 md:!inline-flex"
            >
              LET&apos;S TALK <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid h-11 w-11 place-items-center text-vmm-ink"
              >
                <Menu className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-vmm-ink/65 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content
          className="fixed inset-3 z-[51] flex flex-col overflow-hidden bg-white p-0 shadow-2xl outline-none md:inset-6"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstMenuLinkRef.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigate to a VMM portfolio section.
          </Dialog.Description>

          <div className="vmm-container flex min-h-[76px] w-full items-center justify-between">
            <Wordmark />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center"
              >
                <X className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Menu" className="vmm-container flex flex-1 flex-col justify-center py-8">
            {links.map((link, index) => (
              <a
                key={link.hash}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={onHome ? `#${link.hash}` : `/#${link.hash}`}
                onClick={(event) => handleAnchorClick(event, link.hash)}
                aria-label={link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                aria-current={onHome && active === link.hash ? "location" : undefined}
                className="group flex min-h-14 items-center border-b border-vmm-line font-display text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none hover:text-vmm-red"
              >
                {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                {index === 0 ? <span className="text-vmm-red">.</span> : null}
              </a>
            ))}
          </nav>

          <div className="vmm-container grid w-full grid-cols-2 items-end gap-x-5 gap-y-3 border-t border-vmm-line py-5 text-[11px] font-bold tracking-[0.16em] md:grid-cols-[1fr_auto_1fr]">
            <p>
              UI/UX DESIGNER
              <br />
              &amp; WEB DEVELOPER
            </p>
            <SocialLinks
              facebookUrl={contactConfig.social.facebookUrl}
              linkedinUrl={contactConfig.social.linkedinUrl}
              className="order-3 col-span-2 justify-center md:order-none md:col-span-1"
            />
            <p className="text-right">
              BASED IN PHILIPPINES
              <br />
              <span className="text-vmm-ink">
                <span className="text-vmm-red" aria-hidden="true">
                  —
                </span>{" "}
                AVAILABLE FOR FREELANCE
              </span>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
