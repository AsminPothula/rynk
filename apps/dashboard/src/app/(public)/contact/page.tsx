/**
 * /contact — contact form + alternative channels.
 *
 * Form submission isn't wired to a backend yet — fields exist, the submit
 * button just shows a confirmation state. Real wiring happens when the
 * email pipeline (Resend / React Email) lands.
 */

import { Mail, MessageSquare, Building2 } from "lucide-react";

export default function ContactPage(): React.JSX.Element {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="container py-20 lg:py-24 max-w-3xl">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Contact
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
            We'd love to hear from you.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            Questions about pricing, custom integrations, or running rynk
            for a specific kind of client — drop a note. We read everything.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-16 lg:py-20 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            {/* Form */}
            <form className="space-y-5" action="#" method="post">
              <Field label="Your name" id="name" type="text" placeholder="Asmin Pothula" required />
              <Field label="Email" id="email" type="email" placeholder="you@company.com" required />
              <Field label="Company" id="company" type="text" placeholder="iTech Data Services" />
              <Field label="What kind of work?" id="topic" type="select" options={[
                "Pricing & plans",
                "Custom integration",
                "Demo request",
                "Partnership",
                "Other",
              ]} />
              <Field label="Message" id="message" type="textarea" placeholder="Tell us a bit about what you're working on…" required />

              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Send message
              </button>
              <p className="text-xs text-muted-foreground">
                We respond within one business day.
              </p>
            </form>

            {/* Alternative channels */}
            <div className="space-y-5">
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <Mail className="h-4 w-4 text-foreground/70" />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Email
                </div>
                <a href="mailto:hello@rynk.ai" className="mt-1 block text-sm hover:underline">
                  hello@rynk.ai
                </a>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <MessageSquare className="h-4 w-4 text-foreground/70" />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Sales
                </div>
                <a href="mailto:sales@rynk.ai" className="mt-1 block text-sm hover:underline">
                  sales@rynk.ai
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  Pricing, custom integrations, demo requests.
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <Building2 className="h-4 w-4 text-foreground/70" />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  HQ
                </div>
                <p className="mt-1 text-sm">Hyderabad, India</p>
                <p className="text-sm text-muted-foreground">Remote-first</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Form field renderer ─────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  type: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

function Field({ label, id, type, placeholder, required, options }: FieldProps): React.JSX.Element {
  const sharedClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}{required && <span className="ml-1 text-foreground">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea id={id} name={id} placeholder={placeholder} required={required} rows={5} className={sharedClass} />
      ) : type === "select" ? (
        <select id={id} name={id} required={required} className={sharedClass} defaultValue="">
          <option value="" disabled>Select one…</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input id={id} name={id} type={type} placeholder={placeholder} required={required} className={sharedClass} />
      )}
    </div>
  );
}
