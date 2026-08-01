/**
 * "Try rynk on your site" — the prospect-facing instant scan.
 *
 * Linked from the marketing CTAs. A visitor enters their URL and sees a teaser:
 * 5-7 audit findings + 3-5 strategy recommendations, then a convert CTA.
 * Sample-data driven for now; wires to the runQuickScan backend once hosted.
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SAMPLE_QUICK_SCAN, type QuickScanResult } from './client/tryRynkSample';

const SEV: Record<string, string> = {
  high: 'bg-brand-highlight/15 text-brand-highlight ring-brand-highlight/30',
  medium: 'bg-brand-amber/12 text-brand-amberSoft ring-brand-amber/25',
  low: 'bg-brand-blue/12 text-brand-blueSoft ring-brand-blue/25',
};

export function TryRynk() {
  const [searchParams] = useSearchParams();
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [result, setResult] = useState<QuickScanResult | null>(null);

  function runScan(d: string) {
    setStatus('scanning');
    // Demo: the real scan calls runQuickScan on the backend. Here we show the sample.
    setTimeout(() => {
      setResult({ ...SAMPLE_QUICK_SCAN, domain: d.trim() || SAMPLE_QUICK_SCAN.domain });
      setStatus('done');
    }, 1400);
  }

  function scan(e: React.FormEvent) {
    e.preventDefault();
    runScan(domain);
  }

  // The marketing forms link here as /try?domain=... — auto-run the scan.
  useEffect(() => {
    const d = searchParams.get('domain');
    if (d) {
      setDomain(d);
      runScan(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-ink text-brand-text">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156,140,240,0.18), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109,141,255,0.18), transparent 60%)',
        }}
      />
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <img src="/rynklogo.png" alt="rynk.ai" className="h-9 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Hero + input */}
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">Instant site scan</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium leading-tight tracking-tight">
            See what rynk finds <span className="italic text-brand-blueSoft">on your site.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-brand-textMute">
            Enter your website and get an instant read on what's holding you back — and exactly what rynk would do to grow your visibility.
          </p>

          <form onSubmit={scan} className="mx-auto mt-7 flex max-w-lg items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.yoursite.com"
              aria-label="Your website"
              className="min-w-0 flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'scanning'}
              className="h-11 shrink-0 rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)] disabled:opacity-60"
            >
              {status === 'scanning' ? 'Scanning…' : 'Scan my site'}
            </button>
          </form>
        </div>

        {status === 'scanning' && (
          <p className="mt-10 text-center font-mono text-xs text-brand-textMute animate-pulse">
            Reading your pages · checking search visibility · building your plan…
          </p>
        )}

        {status === 'done' && result && <Results result={result} />}
      </main>
    </div>
  );
}

function Results({ result }: { result: QuickScanResult }) {
  return (
    <div className="mt-12 space-y-10">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-textMute">
          {result.businessType} · {result.domain}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">{result.headline}</h2>
      </div>

      {/* What rynk understood + competitors */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/8 p-5">
          <h3 className="font-serif text-base font-medium">What we understood</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-brand-textMute">{result.summary}</p>
          {result.targetCustomer && (
            <p className="mt-2 text-[12.5px] leading-relaxed text-brand-textMute">
              <span className="text-brand-text/80">You serve:</span> {result.targetCustomer}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/8 p-5">
          <h3 className="font-serif text-base font-medium">Who you're up against</h3>
          <div className="mt-3 space-y-2.5">
            {result.competitors.map((c, i) => (
              <div key={i}>
                <p className="text-sm text-brand-text">
                  {c.name}
                  {c.domain ? <span className="ml-1.5 font-mono text-[11px] text-brand-textMute">{c.domain}</span> : null}
                </p>
                <p className="text-[12.5px] leading-relaxed text-brand-textMute">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit points */}
      <section>
        <h3 className="mb-4 font-serif text-lg font-medium">What we found ({result.auditPoints.length})</h3>
        <div className="space-y-3">
          {result.auditPoints.map((a, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] ring-1 ring-white/8 p-4">
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ring-1', SEV[a.severity])}>
                  {a.severity}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-brand-textMute">{a.category}</span>
              </div>
              <p className="mt-2 font-serif text-[16px] text-brand-text">{a.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-brand-textMute">{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategy points */}
      <section>
        <h3 className="mb-4 font-serif text-lg font-medium">What rynk would do ({result.strategyPoints.length})</h3>
        <div className="space-y-3">
          {result.strategyPoints.map((s, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 p-4">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-violet to-transparent" aria-hidden />
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-violet/15 font-serif text-xs text-brand-violetSoft">{i + 1}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-brand-textMute">{s.impact} impact</span>
              </div>
              <p className="mt-2 font-serif text-[16px] text-brand-text">{s.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-brand-textMute">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Convert */}
      <div className="rounded-[28px] bg-white/[0.02] ring-1 ring-white/8 p-8 text-center">
        <h3 className="font-serif text-2xl font-medium tracking-tight">
          This is just the <span className="italic text-brand-blueSoft">preview.</span>
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-brand-textMute">
          rynk ships these fixes for you and keeps improving your rankings every week — no SEO work on your end.
        </p>
        <a
          href="/sign-in"
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
        >
          Start with rynk →
        </a>
      </div>
    </div>
  );
}
