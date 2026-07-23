import { useRef, useState } from "react";
import { ArrowRight, CalendarClock, Mail, MapPin, MessageCircle, RotateCcw } from "lucide-react";
import { PageNumber } from "@/components/vmm/SideRail";
import { contactConfig, projectTypes } from "@/lib/vmm/contact-config";
import { useGsap } from "@/lib/vmm/useGsap";

type Inquiry = {
  name: string;
  email: string;
  project: string;
  budget: string;
  message: string;
};

type InquiryKey = keyof Inquiry;
type FormState = "idle" | "submitting" | "success" | "failure";

const initialInquiry: Inquiry = { name: "", email: "", project: "", budget: "", message: "" };

function validate(values: Inquiry) {
  const errors: Partial<Record<InquiryKey, string>> = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.project) errors.project = "Select a project type.";
  if (!values.budget) errors.budget = "Select a budget range.";
  if (!values.message.trim()) errors.message = "Tell me a little about your project.";
  return errors;
}

function buildFallbackBody(values: Inquiry) {
  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Project type: ${values.project}`,
    `Budget: ${values.budget}`,
    "",
    values.message,
  ].join("\n");
}

export function ContactSection() {
  const [values, setValues] = useState<Inquiry>(initialInquiry);
  const [errors, setErrors] = useState<Partial<Record<InquiryKey, string>>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [referenceId, setReferenceId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useGsap(({ gsap }) => {
    gsap.from("[data-contact-title]", {
      y: 34,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: "#contact", start: "top 85%" },
    });
  }, []);

  const update = (key: InquiryKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const focusFirstError = (nextErrors: Partial<Record<InquiryKey, string>>) => {
    const first = (Object.keys(initialInquiry) as InquiryKey[]).find((key) => nextErrors[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => focusFirstError(nextErrors));
      return;
    }

    setFormState("submitting");
    const subject = encodeURIComponent(`New project inquiry — ${values.name}`);
    const body = encodeURIComponent(buildFallbackBody(values));
    const mailto = `mailto:${contactConfig.email}?subject=${subject}&body=${body}`;
    // Open the user's mail client with a fully-composed inquiry addressed to hello@vmmcreatives.site
    window.location.href = mailto;
    setReferenceId(`VMM-${Date.now().toString(36).toUpperCase()}`);
    window.setTimeout(() => setFormState("success"), 400);
  };


  const startAnother = () => {
    setValues(initialInquiry);
    setErrors({});
    setReferenceId("");
    setFormState("idle");
    window.requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLInputElement>("[name=name]")?.focus(),
    );
  };

  const fallbackBody = encodeURIComponent(buildFallbackBody(values));
  const emailFallback = `mailto:${contactConfig.email}?subject=${encodeURIComponent("New project inquiry")}&body=${fallbackBody}`;
  const whatsappFallback = `${contactConfig.whatsappUrl}?text=${fallbackBody}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="vmm-section vmm-section-pad overflow-hidden bg-white"
    >
      <div className="vmm-container relative grid gap-10 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="vmm-kicker">GET IN TOUCH</p>
          <h2
            id="contact-title"
            data-contact-title
            aria-label="LET'S BUILD SOMETHING GREAT."
            className="vmm-heading vmm-contact-title mt-4"
          >
            LET&apos;S BUILD SOMETHING GREAT<span className="text-vmm-red">.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-vmm-ink/68">
            Have a project in mind? Share the brief and I&apos;ll respond with a practical next
            step.
          </p>

          <div className="mt-9 space-y-2">
            <Info
              icon={<Mail aria-hidden className="h-5 w-5" />}
              label="EMAIL"
              value={contactConfig.email}
              href={`mailto:${contactConfig.email}`}
            />
            <Info
              icon={<MessageCircle aria-hidden className="h-5 w-5" />}
              label="WHATSAPP"
              value={contactConfig.whatsappDisplay}
              href={contactConfig.whatsappUrl}
              external
            />
            <Info
              icon={<MapPin aria-hidden className="h-5 w-5" />}
              label="LOCATION"
              value="Philippines"
            />
            <Info
              icon={<CalendarClock aria-hidden className="h-5 w-5" />}
              label="AVAILABILITY"
              value="Available for freelance"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:pt-4">
          <div className="border border-vmm-ink bg-white p-5 sm:p-7 lg:p-8">
            {formState === "success" ? (
              <div className="flex min-h-[31rem] flex-col justify-center" role="status">
                <span className="font-display text-lg uppercase text-vmm-red">
                  Inquiry confirmed
                </span>
                <h3 className="mt-3 font-display text-4xl uppercase leading-none md:text-5xl">
                  Your email is ready to send.
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-vmm-ink/68">
                  Your mail client should open with your brief addressed to{" "}
                  <a href={`mailto:${contactConfig.email}`} className="text-vmm-ink underline">
                    {contactConfig.email}
                  </a>
                  . Reference <strong className="text-vmm-ink">{referenceId}</strong>. If nothing
                  opened, use the fallbacks below.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.14em]">
                  <a href={emailFallback} className="min-h-11 border-b-2 border-vmm-ink py-3 hover:text-vmm-red">
                    Email instead
                  </a>
                  <a
                    href={whatsappFallback}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 border-b-2 border-vmm-ink py-3 hover:text-vmm-red"
                  >
                    WhatsApp instead
                  </a>
                </div>
                <button type="button" onClick={startAnother} className="vmm-button mt-8 w-fit">
                  START ANOTHER INQUIRY <RotateCcw aria-hidden className="h-4 w-4" />
                </button>

              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={submit}
                noValidate
                aria-busy={formState === "submitting"}
              >
                {formState === "failure" ? (
                  <div
                    role="alert"
                    className="mb-7 border-l-4 border-vmm-red bg-vmm-red/8 p-4 text-sm leading-6"
                  >
                    <strong className="block font-black uppercase">
                      The inquiry could not be confirmed.
                    </strong>
                    Your details are still here. Retry, or use the direct email and WhatsApp
                    fallbacks below.
                  </div>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="NAME" error={errors.name} className="sm:col-span-1">
                    <input
                      name="name"
                      aria-label="NAME"
                      autoComplete="name"
                      value={values.name}
                      onChange={(event) => update("name", event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="vmm-field"
                    />
                  </Field>
                  <Field label="EMAIL" error={errors.email} className="sm:col-span-1">
                    <input
                      name="email"
                      aria-label="EMAIL"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => update("email", event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="vmm-field"
                    />
                  </Field>
                  <Field label="PROJECT TYPE" error={errors.project}>
                    <select
                      name="project"
                      aria-label="PROJECT TYPE"
                      value={values.project}
                      onChange={(event) => update("project", event.target.value)}
                      aria-invalid={Boolean(errors.project)}
                      aria-describedby={errors.project ? "project-error" : undefined}
                      className="vmm-field"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="BUDGET" error={errors.budget}>
                    <select
                      name="budget"
                      aria-label="BUDGET"
                      value={values.budget}
                      onChange={(event) => update("budget", event.target.value)}
                      aria-invalid={Boolean(errors.budget)}
                      aria-describedby={errors.budget ? "budget-error" : undefined}
                      className="vmm-field"
                    >
                      <option value="">Select budget range</option>
                      {contactConfig.budgetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="MESSAGE" error={errors.message} className="sm:col-span-2">
                    <textarea
                      name="message"
                      aria-label="MESSAGE"
                      rows={5}
                      value={values.message}
                      onChange={(event) => update("message", event.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className="vmm-field resize-y"
                      placeholder="Tell me about the project, audience, and ideal timeline."
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  aria-label={formState === "failure" ? "Retry submission" : "SEND MESSAGE"}
                  className="vmm-button mt-8 w-full justify-between disabled:cursor-wait disabled:opacity-65"
                >
                  {formState === "submitting"
                    ? "SUBMITTING…"
                    : formState === "failure"
                      ? "RETRY SUBMISSION"
                      : "SEND MESSAGE"}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </button>

                {formState === "failure" ? (
                  <div className="mt-5 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.14em]">
                    <a
                      aria-label="Email fallback"
                      href={emailFallback}
                      className="min-h-11 border-b-2 border-vmm-ink py-3 hover:text-vmm-red"
                    >
                      Email instead
                    </a>
                    <a
                      aria-label="WhatsApp fallback"
                      href={whatsappFallback}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-11 border-b-2 border-vmm-ink py-3 hover:text-vmm-red"
                    >
                      WhatsApp instead
                    </a>
                  </div>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
      <span className="vmm-mobile-number md:hidden" aria-hidden>
        006
      </span>
      <PageNumber n="006" />
    </section>
  );
}

function Info({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center bg-vmm-ink text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.65rem] font-black tracking-[0.2em] text-vmm-ink">
          {label}
        </span>
        <span className="block break-words text-sm font-semibold">{value}</span>
      </span>
    </>
  );
  const className = "flex min-h-14 items-center gap-4 border-b border-vmm-line py-3";
  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${className} hover:text-vmm-red`}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const id = label === "PROJECT TYPE" ? "project" : label.toLowerCase();
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[0.66rem] font-black tracking-[0.2em]">{label}</span>
      {children}
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-xs font-bold text-vmm-red">
          {error}
        </span>
      ) : null}
    </label>
  );
}
