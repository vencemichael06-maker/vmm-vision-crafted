import {
  ArrowDownRight,
  Braces,
  Code2,
  LayoutTemplate,
  PencilRuler,
  PenTool,
  Rocket,
  Search,
  Target,
  Workflow,
} from "lucide-react";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";

const services = [
  {
    index: "01",
    title: "UI/UX Design",
    body: "User-centered interfaces with clear journeys, accessible interaction, and a strong visual system.",
    icon: LayoutTemplate,
  },
  {
    index: "02",
    title: "Web Development",
    body: "Responsive, performant websites built with clean structure and dependable front-end engineering.",
    icon: Braces,
  },
  {
    index: "03",
    title: "Branding",
    body: "Distinct identity systems that align voice, typography, color, and real-world brand applications.",
    icon: PenTool,
  },
  {
    index: "04",
    title: "Digital Solutions",
    body: "Practical automation and connected workflows designed around how a business actually operates.",
    icon: Workflow,
  },
] as const;

const process = [
  {
    index: "01",
    label: "Discovery",
    body: "Goals, audiences, constraints, and proof are mapped before decisions are made.",
    icon: Search,
  },
  {
    index: "02",
    label: "Strategy",
    body: "Direction, content hierarchy, and delivery priorities become concrete.",
    icon: Target,
  },
  {
    index: "03",
    label: "Design",
    body: "A responsive visual system turns strategy into a purposeful experience.",
    icon: PencilRuler,
  },
  {
    index: "04",
    label: "Develop",
    body: "The approved experience is engineered, integrated, and tested.",
    icon: Code2,
  },
  {
    index: "05",
    label: "Launch & Support",
    body: "Quality checks lead into a controlled launch and dependable follow-through.",
    icon: Rocket,
  },
] as const;

export function ServicesSection() {
  useGsap(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>("[data-service-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 90%" },
      });
    });
  }, []);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="vmm-section bg-white text-vmm-ink"
    >
      <div className="vmm-section-pad relative">
        <div className="vmm-container grid gap-10 md:grid-cols-12 md:gap-6 lg:gap-10">
          <div className="md:col-span-4">
            <p className="vmm-kicker">SERVICES</p>
            <h2 id="services-title" className="vmm-heading vmm-services-title mt-4">
              SERVICES THAT BUILD RESULTS<span className="text-vmm-red">.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-vmm-ink/65">
              Design and development shaped as one connected practice{"\u2014"}from the first idea
              to the working experience.
            </p>
          </div>

          <ol className="grid border-l border-t border-vmm-ink/30 sm:grid-cols-2 md:col-span-8 lg:grid-cols-4">
            {services.map(({ index, title, body, icon: Icon }) => (
              <li
                key={title}
                data-service-reveal
                className={`group relative min-h-[14rem] border-b border-r border-vmm-ink/30 p-5 transition-colors duration-300 hover:bg-vmm-ink hover:text-white md:min-h-[14.5rem] ${index === "01" ? "lg:bg-vmm-red" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-2xl">{index}</span>
                  <Icon className="h-7 w-7" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="mt-7 max-w-[10ch] font-display text-2xl uppercase leading-[0.96] xl:text-3xl">
                  {title}
                </h3>
                <p
                  className={`mt-3 max-w-xs text-sm leading-5 text-current opacity-70 ${index === "01" ? "lg:opacity-100" : ""}`}
                >
                  {body}
                </p>
                <ArrowDownRight
                  className="absolute bottom-4 right-4 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>
        <span className="vmm-mobile-number md:hidden" aria-hidden>
          004
        </span>
        <PageNumber n="004" />
      </div>

      <section
        id="process"
        aria-labelledby="process-title"
        className="vmm-section-pad relative border-t border-vmm-line bg-white"
      >
        <div className="vmm-container grid gap-8 md:grid-cols-12 md:gap-8 xl:gap-10">
          <div className="md:col-span-12 xl:col-span-5">
            <p className="vmm-kicker">PROCESS</p>
            <h3 id="process-title" className="vmm-heading vmm-process-title mt-4">
              A CLEAR PROCESS<span className="text-vmm-red">.</span> MEASURABLE RESULTS
              <span className="text-vmm-red">.</span>
            </h3>
          </div>

          <ol className="border-t-2 border-vmm-ink md:col-span-12 md:grid md:grid-cols-5 xl:col-span-7">
            {process.map(({ index, label, body, icon: Icon }) => (
              <li
                key={index}
                data-service-reveal
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-vmm-ink py-5 md:block md:min-h-[15.5rem] md:border-r md:px-4 md:py-5 last:md:border-r-0"
              >
                <span className="font-display text-xl text-vmm-ink">{index}</span>
                <div>
                  <Icon
                    className="mb-3 mt-1 h-7 w-7 text-vmm-red md:mt-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <h4 className="font-display text-xl uppercase leading-none">{label}</h4>
                  <p className="mt-3 text-sm leading-6 text-vmm-ink/65 md:text-[0.8125rem] md:leading-[1.45]">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <span className="vmm-mobile-number md:hidden" aria-hidden>
          005
        </span>
        <PageNumber n="005" />
      </section>
    </section>
  );
}
