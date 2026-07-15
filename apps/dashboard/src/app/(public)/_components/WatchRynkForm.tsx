"use client";

/**
 * WatchRynkForm — the "drop your domain in" input on the landing page.
 * Triggers onboarding (POST /api/onboard), then routes to the review/run
 * page. Onboarding takes ~1 min, so it shows a loading state meanwhile.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

export function WatchRynkForm(): React.JSX.Element {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not analyze that site.");
      router.push(`/app/run/${encodeURIComponent(data.domain)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="group relative flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-violetSoft" />
        ) : (
          <Sparkles className="h-4 w-4 text-brand-violetSoft" />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="yoursite.com"
          aria-label="Your domain"
          disabled={loading}
          className="flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Scan my site"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105 disabled:opacity-60"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      {loading && (
        <p className="mt-3 text-[13px] text-brand-textMute">Analyzing your site — about a minute…</p>
      )}
      {error && <p className="mt-3 text-[13px] text-brand-pinkSoft">{error}</p>}
    </div>
  );
}
