import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { getProject, projects } from "@/lib/vmm/projects";
import apkAsset from "@/assets/vmm/downloads/wiseassistant-beta.apk.asset.json";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Case study not found — VMM" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { project: p } = loaderData;
    const title = `${p.title} — VMM Case Study`;
    return {
      meta: [
        { title },
        { name: "description", content: p.subtitle },
        { property: "og:title", content: title },
        { property: "og:description", content: p.subtitle },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const isWiseAssistant = p.slug === "wiseassistant";

  return (
    <div className="min-h-screen bg-vmm-canvas text-vmm-ink">
      <header className="border-b border-vmm-line bg-vmm-canvas/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1520px] items-center justify-between px-5 py-5 md:px-16">
          <Link
            to="/"
            hash="work"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-vmm-ink hover:text-vmm-red"
          >
            <ArrowLeft className="h-4 w-4" /> Back to work
          </Link>
          <span className="font-display text-lg text-vmm-red">{p.index}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-16 md:py-24">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-vmm-red">
          {p.category} · {p.status}
        </p>
        <h1
          className="mt-4 font-display uppercase leading-[0.95]"
          style={{ fontSize: "clamp(40px, 6vw, 84px)", letterSpacing: "-0.02em" }}
        >
          {p.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-vmm-ink/80">{p.subtitle}</p>

        {p.statusNote && (
          <div className="mt-6 inline-block rounded-md border border-vmm-line bg-white px-4 py-3 text-[13px] text-vmm-ink/70">
            <strong className="font-bold text-vmm-ink">Note:</strong> {p.statusNote}
          </div>
        )}

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-vmm-line py-6 md:grid-cols-4">
          <MetaCell label="Role" value={p.role} />
          <MetaCell label="Year" value={p.year} />
          <MetaCell label="Category" value={p.category} />
          <MetaCell label="Stack" value={p.stack.join(", ")} />
        </dl>

        <section className="mt-12 max-w-2xl">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.28em] text-vmm-red">
            Overview
          </h2>
          <p className="mt-4 text-base leading-relaxed text-vmm-ink/85">{p.summary}</p>
        </section>

        {isWiseAssistant && (
          <section
            aria-label="Android Beta download"
            className="mt-10 rounded-2xl border border-vmm-red/30 bg-vmm-red/[0.04] p-6 md:p-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-vmm-red">
              Android Beta · v1.1.0
            </p>
            <h3 className="mt-2 font-display text-2xl">Try WiseAssistant on your device</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-vmm-ink/70">
              This is a debug-signed preview build. Install at your own discretion — this is not a
              Play Store production release. Android will warn you before installing an APK from
              outside the Play Store; that's expected.
            </p>
            <a
              href="/downloads/WiseAssistant-Beta.v1.1.0.apk"
              download="WiseAssistant-Beta.v1.1.0.apk"
              className="mt-6 inline-flex items-center gap-3 rounded-md bg-vmm-ink px-5 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" /> Download APK (16 MB)
            </a>
          </section>
        )}

        {p.cta.kind === "external" && (
          <a
            href={p.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-vmm-ink px-5 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white"
          >
            {p.cta.label} <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <section className="mt-16 space-y-8">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.28em] text-vmm-red">
            Selected screens
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {p.gallery.map((g: { src: string; caption: string }) => (
              <figure
                key={g.src}
                className="overflow-hidden rounded-xl border border-vmm-line bg-vmm-canvas"
              >
                <div className="aspect-[16/10] w-full">
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <figcaption className="border-t border-vmm-line px-4 py-3 text-[12px] text-vmm-ink/70">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <nav aria-label="Other projects" className="mt-20 border-t border-vmm-line pt-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-vmm-red">More work</p>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {projects
              .filter((o) => o.slug !== p.slug)
              .map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/work/$slug"
                    params={{ slug: o.slug }}
                    className="flex items-center justify-between rounded-lg border border-vmm-line bg-white px-4 py-3 text-sm hover:border-vmm-red hover:text-vmm-red"
                  >
                    <span>
                      <span className="font-display text-base">{o.index}</span> · {o.title}
                    </span>
                    <span className="text-vmm-red">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-vmm-ink/50">{label}</dt>
      <dd className="mt-1 text-sm text-vmm-ink">{value}</dd>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-vmm-canvas px-6 text-center">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-vmm-red">404</p>
        <h1 className="mt-3 font-display text-4xl">Case study not found</h1>
        <Link
          to="/"
          hash="work"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-vmm-ink px-5 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to work
        </Link>
      </div>
    </div>
  );
}
