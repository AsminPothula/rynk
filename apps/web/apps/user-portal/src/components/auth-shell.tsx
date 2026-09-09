/**
 * Auth layout — the navy rynk.ai shell around the sign-in / sign-up / forgot
 * screens. Brand mark, ambient gradient, a centered card, and a short value line
 * on the side (desktop) so the auth pages feel like the product, not a starter.
 */
import type { ReactNode } from 'react';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ink px-6 py-12 text-brand-text">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156,140,240,0.18), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109,141,255,0.18), transparent 60%)',
        }}
      />

      <div className="grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
        {/* Brand / value side (desktop only) */}
        <div className="hidden md:block">
          <img src="/rynklogo.png" alt="rynk.ai" className="h-12 w-auto" />
          <h2 className="mt-8 font-serif text-4xl font-medium leading-[1.1] tracking-tight">
            Get found everywhere your customers <span className="italic text-brand-blueSoft">search.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-textMute">
            rynk audits your site, writes and publishes the fixes, and keeps you ranking on Google and AI — automatically.
          </p>
          <ul className="mt-8 space-y-2.5 text-[13.5px] text-brand-textMute">
            {['Full technical + content audit', 'Auto-published fixes & new pages', 'Ranking + AI-visibility tracking'].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blueSoft" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Card */}
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white/[0.03] p-8 ring-1 ring-white/10 backdrop-blur-xl md:p-9">
          {/* Logo on mobile (side panel is hidden) */}
          <img src="/rynklogo.png" alt="rynk.ai" className="mb-6 h-10 w-auto md:hidden" />
          <h1 className="font-serif text-2xl font-medium tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[14px] leading-relaxed text-brand-textMute">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-[13.5px] text-brand-textMute">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

/** Shared labeled input for the auth forms. */
export function AuthField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-brand-textMute">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl bg-white/[0.04] px-4 py-2.5 text-[15px] text-brand-text placeholder:text-brand-textMute/60 outline-none ring-1 ring-white/12 transition-colors focus:ring-brand-blue/60"
      />
      {error && <span className="mt-1 block text-[12px] text-rose-400">{error}</span>}
    </label>
  );
}

/** Primary submit button. */
export function AuthButton({ pending, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
