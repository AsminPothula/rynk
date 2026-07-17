/**
 * /sign-in - single auth entry page.
 *
 * Design decision (Asmin): show the signup form as the primary flow, since
 * most people hitting this page from the nav are new. Existing users click
 * the small "Log in" link at the bottom which routes to /login.
 *
 * Fields are placeholders; wire real submission in the auth work.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignInPage(): React.JSX.Element {
  return (
    <div className="relative text-brand-text overflow-x-hidden">
      <section className="relative px-6 pt-16 pb-24 md:px-10 lg:px-14 md:pt-24">
        {/* Ambient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-8 h-80 w-80 rounded-full bg-brand-violet/20 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 right-8 h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-md">
          {/* Header */}
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">
              Get started
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight text-brand-text">
              Plug rynk into <span className="italic text-brand-blueSoft">your site.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
              Five-minute setup. Rynk audits, plans, and starts shipping the
              first fixes within the day.
            </p>
          </div>

          {/* Signup card */}
          <form
            action="/signup"
            className="relative mt-10 rounded-2xl bg-gradient-to-br from-brand-ink2/90 to-brand-surface/85 backdrop-blur-md ring-1 ring-white/10 p-7 md:p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue to-transparent" aria-hidden />

            <div className="space-y-4">
              <Field label="Company" name="company" placeholder="Acme Inc." />
              <Field label="Website" name="domain" placeholder="acme.com" />
              <Field label="Email" name="email" type="email" placeholder="you@acme.com" />
              <Field label="Password" name="password" type="password" placeholder="Create a password" />
            </div>

            <button
              type="submit"
              className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
            >
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="mt-5 text-center text-[12px] text-brand-textMute">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-brand-text">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-text">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* Secondary: existing users */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[14px] text-brand-textMute">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="group inline-flex items-center gap-1 font-serif text-brand-text underline underline-offset-4 decoration-brand-violet/50 hover:decoration-brand-violet"
            >
              Log in
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}): React.JSX.Element {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-textMute">
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-lg bg-black/25 ring-1 ring-white/10 px-4 py-2.5 font-serif text-[15px] text-brand-text placeholder:text-brand-textMute/70 focus:outline-none focus:ring-brand-blue/60 transition-all"
      />
    </label>
  );
}
