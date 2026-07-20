import { ArrowRight, Braces, Layout, PenTool, Settings2, Search, Pencil, Code, Send } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";

const services = [
  { icon: <Layout className="h-6 w-6" />, title: "UI/UX Design", body: "User-centered designs that are intuitive, accessible, and built to convert." },
  { icon: <Braces className="h-6 w-6" />, title: "Web Development", body: "Clean, responsive, and high-performance websites built with modern technologies." },
  { icon: <PenTool className="h-6 w-6" />, title: "Branding", body: "Unique identities and visual systems that communicate trust and stand out." },
  { icon: <Settings2 className="h-6 w-6" />, title: "Digital Solutions", body: "Automation, integrations, and workflows that streamline and scale your business." },
];

const process = [
  { n: "01", label: "DISCOVER", icon: <Search className="h-5 w-5" />, body: "We understand your goals, audience and challenges to define the right direction." },
  { n: "02", label: "DESIGN", icon: <Pencil className="h-5 w-5" />, body: "We craft intuitive designs that communicate your brand and engage users." },
  { n: "03", label: "DEVELOP", icon: <Code className="h-5 w-5" />, body: "We build fast, responsive and scalable solutions with clean code." },
  { n: "04", label: "LAUNCH", icon: <Send className="h-5 w-5" />, body: "We test, optimize and launch to deliver results and drive growth." },
];

export function ServicesSection() {
  useGsap(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>("[data-svc-reveal]").forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }, []);

  return (
    <section id="services" aria-label="Services" className="relative w-full overflow-hidden py-24 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <Orbs items={[
        { size: "m", top: "10%", left: "22%", opacity: 0.4 },
        { size: "s", top: "6%", right: "22%", opacity: 0.35 },
        { size: "s", bottom: "20%", right: "6%", opacity: 0.35 },
      ]} />

      <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:px-16 lg:px-24">
        <div className="md:col-span-12" data-svc-reveal>
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">SERVICES</p>
          <h2 className="mt-4 font-display leading-[0.9]"
            style={{ fontSize: "clamp(44px, 5.5vw, 88px)", letterSpacing: "-0.02em" }}>
            <span className="block">SERVICES THAT</span>
            <span className="block">BUILD RESULTS<span className="text-vmm-red">.</span></span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-vmm-ink/80">
            I help brands and businesses turn ideas into powerful digital experiences through thoughtful design and clean, scalable development.
          </p>
        </div>

        <div className="md:col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} data-svc-reveal
              className="group relative flex h-full flex-col rounded-2xl border border-vmm-line bg-white p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)] transition hover:-translate-y-1">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-vmm-red/10 text-vmm-red">{s.icon}</span>
              <h3 className="mt-5 font-display text-xl">{s.title.toUpperCase()}</h3>
              <p className="mt-3 text-sm leading-relaxed text-vmm-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="mx-auto mt-20 w-full max-w-[1760px] px-5 md:mt-28 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-display text-6xl md:text-7xl">004</div>
            <p className="mt-6 text-[13px] font-bold tracking-[0.28em] text-vmm-red">MY PROCESS</p>
            <h3 className="mt-3 font-display text-4xl md:text-5xl">
              A CLEAR PROCESS.<br />
              MEASURABLE RESULTS<span className="text-vmm-red">.</span>
            </h3>
            <p className="mt-4 max-w-md text-sm text-vmm-ink/70">
              A collaborative and transparent workflow designed to bring clarity, speed and quality to every project.
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="pointer-events-none absolute inset-x-4 top-8 hidden h-px border-t border-dashed border-vmm-ink/30 md:block" />
              {process.map((p) => (
                <div key={p.n} data-svc-reveal className="relative flex flex-col items-center text-center">
                  <div className="text-[13px] font-bold tracking-[0.24em]">
                    <span className="font-display text-lg">{p.n}</span> <span className="ml-1">{p.label}</span>
                  </div>
                  <div className="mt-3 grid h-14 w-14 place-items-center rounded-full border-2 border-vmm-ink/70 bg-white text-vmm-ink">
                    {p.icon}
                  </div>
                  <p className="mt-4 max-w-[180px] text-sm text-vmm-ink/70">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PageNumber n="004" />
    </section>
  );
}
