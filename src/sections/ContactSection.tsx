import { useState } from "react";
import { ArrowRight, CalendarClock, Headphones, Mail, MapPin } from "lucide-react";
import { Orbs } from "@/components/vmm/Orbs";
import { PageNumber } from "@/components/vmm/SideRail";
import { useGsap } from "@/lib/vmm/useGsap";

export function ContactSection() {
  useGsap(({ gsap }) => {
    gsap.from(".ct-title span", { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: "#contact", start: "top 70%" } });
    gsap.from(".ct-red-panel", { scaleX: 0, transformOrigin: "right center", duration: 1.1, ease: "power4.inOut",
      scrollTrigger: { trigger: "#contact", start: "top 70%" } });
  }, []);

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name") ?? ""}`,
      `Email: ${f.get("email") ?? ""}`,
      `Project type: ${f.get("project") ?? ""}`,
      `Budget: ${f.get("budget") ?? ""}`,
      "",
      String(f.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:hello@vmm.studio?subject=${encodeURIComponent("New project inquiry")}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };


  return (
    <section id="contact" aria-label="Contact" className="relative w-full overflow-hidden py-16 md:py-32" style={{ scrollMarginTop: "80px" }}>
      <Orbs items={[
        { size: "s", top: "10%", left: "8%", opacity: 0.35 },
        { size: "m", top: "6%", left: "26%", opacity: 0.4 },
        { size: "s", bottom: "20%", left: "4%", opacity: 0.35 },
      ]} />

      <div aria-hidden className="ct-red-panel absolute right-0 top-24 hidden h-[75%] w-[52%] bg-vmm-red md:block" />

      <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:px-16 lg:px-24">
        <div className="md:col-span-5">
          <p className="text-[13px] font-bold tracking-[0.28em] text-vmm-red">GET IN TOUCH</p>
          <h2 className="ct-title mt-4 font-display text-[3.25rem] leading-[0.9] sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block">LET'S BUILD</span>
            <span className="block">SOMETHING</span>
            <span className="block">GREAT<span className="text-vmm-red">.</span></span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-vmm-ink/80">
            I help brands and businesses create impactful digital experiences through web design, UI/UX, branding, and digital solutions.
          </p>

          <div className="mt-10 space-y-6">
            <Info icon={<Mail className="h-5 w-5" />} label="EMAIL" value="hello@vmm.studio" />
            <Info icon={<MapPin className="h-5 w-5" />} label="LOCATION" value="Philippines" />
            <Info icon={<CalendarClock className="h-5 w-5" />} label="AVAILABILITY" value="Available for freelance" />
          </div>
        </div>

        <div className="relative md:col-span-7">
          <div className="relative rounded-2xl bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] md:p-10">
            {submitted ? (
              <div className="grid place-items-center py-16 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-vmm-red text-white">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-3xl">MESSAGE READY<span className="text-vmm-red">.</span></h3>
                <p className="mt-3 max-w-md text-sm text-vmm-ink/70">
                  This visual demo doesn't send email. Copy your message and reach out at hello@vmm.studio to continue the conversation.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <Field label="NAME"><input name="name" required placeholder="Your full name" className="w-full border-b border-vmm-ink/60 bg-transparent py-2 text-base outline-none placeholder:text-vmm-ink/40 focus:border-vmm-red" /></Field>
                <Field label="EMAIL"><input name="email" required type="email" placeholder="Your email address" className="w-full border-b border-vmm-ink/60 bg-transparent py-2 text-base outline-none placeholder:text-vmm-ink/40 focus:border-vmm-red" /></Field>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="PROJECT TYPE">
                    <select name="project" className="w-full appearance-none border-b border-vmm-ink/60 bg-transparent py-2 text-base outline-none focus:border-vmm-red">
                      <option>Select project type</option><option>Website</option><option>Web app</option><option>Mobile app</option><option>Branding</option>
                    </select>
                  </Field>
                  <Field label="BUDGET">
                    <select name="budget" className="w-full appearance-none border-b border-vmm-ink/60 bg-transparent py-2 text-base outline-none focus:border-vmm-red">
                      <option>Select budget range</option><option>&lt; $2k</option><option>$2k – $5k</option><option>$5k – $10k</option><option>$10k+</option>
                    </select>
                  </Field>
                </div>
                <Field label="MESSAGE">
                  <textarea name="message" rows={4} placeholder="Tell me about your project…" className="w-full resize-none border-b border-vmm-ink/60 bg-transparent py-2 text-base outline-none placeholder:text-vmm-ink/40 focus:border-vmm-red" />
                </Field>
                <button type="submit" className="mt-2 inline-flex w-full items-center justify-between gap-3 rounded-md bg-vmm-ink px-6 py-4 text-[12px] font-bold tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5">
                  SEND MESSAGE <ArrowRight className="h-4 w-4" />
                </button>
              </form>

            )}
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)] md:mt-8">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-vmm-ink text-white">
              <Headphones className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Prefer a quick chat?</p>
              <p className="text-xs text-vmm-ink/70">Book a free 30-min consultation and let's talk about how we can work together.</p>
            </div>
            <a href="mailto:hello@vmm.studio" className="inline-flex items-center gap-2 border-b border-vmm-ink text-[12px] font-bold tracking-[0.2em] hover:text-vmm-red">
              BOOK A CALL <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <PageNumber n="005" />
    </section>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-vmm-line pb-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-vmm-ink text-white">{icon}</span>
      <div>
        <div className="text-[11px] font-bold tracking-[0.2em] text-vmm-red">{label}</div>
        <div className="text-base">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold tracking-[0.2em]">{label}</span>
      {children}
    </label>
  );
}
