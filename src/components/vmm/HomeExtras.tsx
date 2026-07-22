import { Wordmark } from "./Wordmark";

const footerLinks = [
  ["home", "Home"],
  ["about", "About"],
  ["work", "Work"],
  ["services", "Services"],
  ["contact", "Contact"],
] as const;

export function HomeFooter() {
  return (
    <footer className="w-full bg-vmm-ink text-white">
      <div className="vmm-container grid gap-10 py-14 md:grid-cols-2 md:items-end md:py-20">
        <div>
          <Wordmark className="text-white [&>span:first-child]:text-white" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            UI/UX Designer &amp; Web Developer building clean, modern, and impactful digital
            experiences.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-1 md:justify-self-end">
          {footerLinks.map(([hash, label]) => (
            <a
              key={hash}
              href={`#${hash}`}
              className="inline-flex min-h-11 items-center text-sm text-white/70 hover:text-vmm-red"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="vmm-container flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Vence Michael Montero. All rights reserved.</p>
          <p>Philippines · Available for freelance</p>
        </div>
      </div>
    </footer>
  );
}
