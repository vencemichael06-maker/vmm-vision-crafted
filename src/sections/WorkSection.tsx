import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";
import { categoryFilters, projects, type Project, type ProjectCategory } from "@/lib/vmm/projects";

const CURATED_PROJECT_COUNT = 4;

export function WorkSection() {
  const [filter, setFilter] = useState<(typeof categoryFilters)[number]>("All");
  const [expanded, setExpanded] = useState(false);
  const matchingProjects = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );
  const visibleProjects =
    filter === "All" && !expanded
      ? matchingProjects.slice(0, CURATED_PROJECT_COUNT)
      : matchingProjects;

  useGsap(
    ({ gsap }) => {
      gsap.utils.toArray<HTMLElement>("[data-work-row]").forEach((row) => {
        gsap.from(row, {
          y: 28,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
      });
    },
    [visibleProjects.length],
  );

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="vmm-section vmm-section-pad bg-white"
    >
      <div className="vmm-container">
        <div className="grid gap-7 border-b-2 border-vmm-ink pb-8 md:grid-cols-12 md:items-end md:pb-10">
          <div className="md:col-span-8">
            <p className="vmm-kicker">MY WORK</p>
            <h2 id="work-title" className="vmm-heading mt-4 max-w-[11ch]">
              PROJECTS THAT DELIVER<span className="text-vmm-red">.</span>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-vmm-ink/70 md:col-span-4 md:pb-1">
            Seven proof-backed projects across websites, mobile product design, and automation.
          </p>
        </div>

        <div
          aria-label="Filter projects by category"
          className="mt-7 hidden flex-wrap items-center gap-x-7 gap-y-2 md:flex"
        >
          {categoryFilters.map((label) => {
            const isActive = filter === label;
            const count =
              label === "All"
                ? projects.length
                : projects.filter((project) => project.category === (label as ProjectCategory))
                    .length;

            return (
              <button
                key={label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(label)}
                className={`border-b-2 py-3 text-[0.7rem] font-black uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "border-vmm-red text-vmm-ink"
                    : "border-transparent text-vmm-ink/65 hover:border-vmm-ink hover:text-vmm-ink"
                }`}
              >
                {label} <span aria-hidden>({count})</span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}.
        </p>

        <ol id="additional-projects" className="mt-8 border-t border-vmm-ink md:mt-10">
          {visibleProjects.map((project) => (
            <li
              key={project.slug}
              data-work-row
              data-testid="work-project"
              className="border-b border-vmm-ink"
            >
              <ProjectRow project={project} />
            </li>
          ))}
        </ol>

        {filter === "All" ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="additional-projects"
            onClick={() => setExpanded((current) => !current)}
            className="vmm-work-disclosure"
          >
            <span>{expanded ? "Show fewer projects" : "View more projects"}</span>
            <span aria-hidden>
              {expanded ? "−" : `${projects.length - CURATED_PROJECT_COUNT} more +`}
            </span>
          </button>
        ) : null}
      </div>
      <span className="vmm-mobile-number md:hidden" aria-hidden>
        003
      </span>
      <PageNumber n="003" />
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const external = project.cta.kind === "external";
  const content = (
    <>
      <div className="vmm-work-media relative overflow-hidden bg-[#ecece8]">
        <picture className="block h-full w-full">
          <source media="(max-width: 767px)" srcSet={project.thumbnail.mobile} />
          <img
            data-project-thumbnail
            src={project.thumbnail.desktop}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          />
        </picture>
        <span className="absolute right-0 top-0 bg-vmm-red px-3 py-2 font-display text-xl text-white">
          {project.index}
        </span>
      </div>
      <div className="vmm-work-copy flex min-w-0 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.65rem] font-black uppercase tracking-[0.2em]">
          <span className="border-l-[3px] border-vmm-red pl-2 text-vmm-ink">
            {project.category}
          </span>
          <span className="text-vmm-ink/55">{project.status}</span>
        </div>
        <h3 className="vmm-work-title mt-3 max-w-[19ch] font-display uppercase">{project.title}</h3>
        <p className="vmm-work-subtitle mt-4 max-w-xl text-sm leading-6 text-vmm-ink/68">
          {project.subtitle}
        </p>
        {project.statusNote ? (
          <p className="vmm-work-note mt-2 text-xs font-semibold text-vmm-ink/65">
            {project.statusNote}
          </p>
        ) : null}
        <span className="vmm-work-cta mt-6 inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em]">
          {project.cta.label}
          {external ? (
            <ExternalLink aria-hidden className="h-4 w-4" />
          ) : (
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          )}
        </span>
      </div>
    </>
  );

  const className = "vmm-work-row group grid focus-visible:outline-offset-4";

  if (project.cta.kind === "external") {
    return (
      <a href={project.cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to="/work/$slug" params={{ slug: project.slug }} className={className}>
      {content}
    </Link>
  );
}
