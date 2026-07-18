import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/vmm/Nav";
import { Orbs } from "@/components/vmm/Orbs";
import { HomeFooter } from "@/components/vmm/HomeExtras";
import { useGsap } from "@/lib/vmm/useGsap";
import { getProject, projects, type Project } from "@/lib/vmm/projects";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.project;
    return {
      meta: [
        { title: `${p.title} — VMM` },
        { name: "description", content: p.subtitle },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.subtitle },
        { property: "og:image", content: p.cover },
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-6xl">Project not found<span className="text-vmm-red">.</span></h1>
        <a href="/#work" className="mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] hover:text-vmm-red">
          <ArrowLeft className="h-4 w-4" /> BACK TO WORK
        </Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const { project } = Route.useLoaderData() as { project: Project };

  useGsap(({ gsap }) => {
    gsap.from(".pd-title span", { y: 60, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
    gsap.from(".pd-red", { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power4.inOut", delay: 0.15 });
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }, [project.slug]);

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="relative">
      <Nav />

      <section className="relative w-full overflow-hidden pt-28 md:pt-32">
        <Orbs items={[
          { size: "s", top: "16%", left: "6%", opacity: 0.35 },
          { size: "m", top: "10%", right: "8%", opacity: 0.35 },
        ]} />

        <div className="mx-auto w-full max-w-[1760px] px-5 md:px-16 lg:px-24">
          <a href="/#work" className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] hover:text-vmm-red">
            <ArrowLeft className="h-4 w-4" /> BACK TO WORK
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">{project.category}</p>
              <h1 className="pd-title mt-3 font-display text-5xl leading-[0.9] md:text-7xl lg:text-8xl">
                <span className="block">{project.title.split("—")[0].trim()}<span className="text-vmm-red">.</span></span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-vmm-ink/80">{project.subtitle}</p>
            </div>
            <div className="md:col-span-4">
              <dl className="grid grid-cols-2 gap-4 text-sm md:mt-8">
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.2em] text-vmm-red">ROLE</dt>
                  <dd className="mt-1">{project.meta.role}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.2em] text-vmm-red">YEAR</dt>
                  <dd className="mt-1">{project.meta.year}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[11px] font-bold tracking-[0.2em] text-vmm-red">STACK</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {project.meta.stack.map((s) => (
                      <span key={s} className="rounded-full border border-vmm-line bg-white px-3 py-1 text-xs">{s}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed cover with red panel behind */}
      <section className="relative mt-10 w-full md:mt-16">
        <div className="pd-red absolute inset-x-0 top-16 -z-0 hidden h-[calc(100%-4rem)] bg-vmm-red md:block" />
        <div className="relative mx-auto w-full max-w-[1760px] px-5 md:px-16 lg:px-24">
          <div className="overflow-hidden rounded-2xl bg-vmm-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
            <img src={project.cover} alt={project.title} className="h-auto w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-12 md:px-16 md:py-28 lg:px-24">
        <div className="md:col-span-4">
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">OVERVIEW</p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            THE STORY<span className="text-vmm-red">.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
          <p className="text-lg leading-relaxed text-vmm-ink/85">{project.description}</p>
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section className="mx-auto w-full max-w-[1760px] px-5 pb-24 md:px-16 lg:px-24">
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">GALLERY</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">SELECTED SCREENS<span className="text-vmm-red">.</span></h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {project.gallery.map((g, i) => (
              <figure key={i} data-reveal className={`overflow-hidden rounded-2xl bg-white p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)] ${i === 0 && project.gallery.length > 2 ? "md:col-span-2" : ""}`}>
                <div className="overflow-hidden rounded-xl bg-vmm-ink">
                  <img src={g.src} alt={g.caption} className="h-auto w-full object-cover" />
                </div>
                <figcaption className="px-2 pt-4 pb-2 text-sm text-vmm-ink/70">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Next projects */}
      <section className="mx-auto w-full max-w-[1760px] px-5 pb-24 md:px-16 lg:px-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl md:text-5xl">MORE WORK<span className="text-vmm-red">.</span></h2>
          <a href="/#work" className="text-[12px] font-bold tracking-[0.2em] hover:text-vmm-red">VIEW ALL →</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              to="/work/$slug"
              params={{ slug: p.slug }}
              className="group relative block overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] transition hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-vmm-ink">
                <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.24em] text-vmm-red">{p.category}</p>
                  <h3 className="mt-2 font-display text-xl">{p.title}</h3>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-md bg-vmm-red text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
