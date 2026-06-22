/**
 * /login — UI only.
 *
 * Form fields wired but submission goes nowhere until we add Auth.js.
 * Centered card layout, minimal — Stripe/Vercel auth pattern.
 */

import Link from "next/link";

export default function LoginPage(): React.JSX.Element {
  return (
    <section className="flex flex-1 items-center justify-center py-16 lg:py-24">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="text-base font-medium tracking-tight">
            rynk<span className="text-primary">.</span>
          </Link>
          <h1 className="mt-8 text-2xl font-medium tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <form className="mt-10 space-y-4" action="#" method="post">
          <div>
            <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Link href="/forgot-password" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex h-10 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
