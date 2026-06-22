/**
 * /signup — UI only.
 *
 * Mirrors /login layout but with an extra field (workspace name) and a
 * different CTA. Auth wiring lands when we add the DB.
 */

import Link from "next/link";

export default function SignupPage(): React.JSX.Element {
  return (
    <section className="flex flex-1 items-center justify-center py-16 lg:py-24">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="text-base font-medium tracking-tight">
            rynk<span className="text-primary">.</span>
          </Link>
          <h1 className="mt-8 text-2xl font-medium tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Run your first audit in minutes.
          </p>
        </div>

        <form className="mt-10 space-y-4" action="#" method="post">
          <div>
            <label htmlFor="workspace" className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Workspace name
            </label>
            <input
              id="workspace"
              name="workspace"
              type="text"
              required
              placeholder="iTech Data Services"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Work email
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
            <label htmlFor="password" className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              At least 12 characters.
            </p>
          </div>
          <button
            type="submit"
            className="w-full inline-flex h-10 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Create account
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
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
