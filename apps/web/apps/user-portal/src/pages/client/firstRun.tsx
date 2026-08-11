/**
 * First-run setup wizard — the guided flow a client sees the first time they
 * open a brand-new site, before the dashboard has any data.
 *
 * Flow (6 states): start → onboarding → profile → settings → running → done.
 * The `profile` and `settings` steps reuse the real Profile/Settings tabs with
 * a first-run banner + Continue; the other states are full-screen views here.
 */
import { useEffect, useState } from 'react';
import { ArrowRight, Search, CheckCircle2, Rocket, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientData } from './sampleData';

export type SetupStep = 'start' | 'onboarding' | 'profile' | 'settings' | 'running' | 'done';

/** States that take over the whole content area (vs. overlaying a tab). */
export function isFullScreenSetup(step: SetupStep | null): boolean {
  return step === 'start' || step === 'onboarding' || step === 'running';
}

// ── State 1 — Start screen ──────────────────────────────────────────────────

export function SetupStart({ client, onStart }: { client: ClientData; onStart: () => void }) {
  const steps = [
    { icon: Search, title: 'Understand', body: 'rynk studies your site and learns your business.' },
    { icon: CheckCircle2, title: 'Confirm', body: 'You check what we understood and how we publish.' },
    { icon: Rocket, title: 'Optimize', body: 'rynk audits, fixes, writes, and publishes — for you.' },
  ];
  return (
    <div className="mx-auto max-w-2xl py-8 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">First-time setup</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight">
        Let&rsquo;s set up rynk for <span className="italic text-brand-blueSoft">{client.domain}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-brand-textMute">
        This takes a few minutes. rynk gets to know your business, you confirm a couple of things, then it optimizes your site automatically.
      </p>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/8">
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-brand-blueSoft" />
              <span className="font-mono text-[10px] uppercase tracking-wide text-brand-textMute">Step {i + 1}</span>
            </div>
            <p className="mt-2 font-serif text-base text-brand-text">{s.title}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-brand-textMute">{s.body}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
      >
        Start setup
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── State 2 — Onboarding ("getting to know your business") ──────────────────

export function SetupOnboarding({ onDone }: { onDone: () => void }) {
  const notes = [
    'Reading your website…',
    'Understanding your services…',
    'Finding your competitors…',
    'Building your business profile…',
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const cycle = setInterval(() => setI((x) => Math.min(x + 1, notes.length - 1)), 1000);
    const done = setTimeout(onDone, notes.length * 1000 + 500);
    return () => {
      clearInterval(cycle);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-blueSoft" />
      <h2 className="mt-6 font-serif text-2xl md:text-3xl font-medium tracking-tight">Getting to know your business…</h2>
      <p className="mt-3 font-mono text-[13px] text-brand-textMute">{notes[i]}</p>
    </div>
  );
}

// ── State 5 — Running (audit → strategy → generate → publish) ───────────────

export function SetupRunning({ onDone }: { onDone: () => void }) {
  const phases = [
    'Auditing your site',
    'Analyzing your competitors',
    'Researching keywords',
    'Building your content strategy',
    'Generating content',
    'Applying technical fixes & publishing',
  ];
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        const next = p + 2;
        if (next >= 100) {
          clearInterval(t);
          setTimeout(onDone, 600);
          return 100;
        }
        return next;
      });
    }, 110);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const phaseIdx = Math.min(phases.length - 1, Math.floor((pct / 100) * phases.length));
  return (
    <div className="mx-auto max-w-xl py-14">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">Optimizing your site</p>
        <h2 className="mt-3 font-serif text-2xl md:text-3xl font-medium tracking-tight">Building your dashboard…</h2>
        <p className="mt-2 text-[14px] text-brand-textMute">This runs in the background — you can leave and come back.</p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between font-mono text-[12px] text-brand-textMute">
          <span>{phases[phaseIdx]}…</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {phases.map((ph, idx) => (
          <div key={ph} className="flex items-center gap-2.5 text-[13px]">
            {idx < phaseIdx ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-emeraldSoft" />
            ) : idx === phaseIdx ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-blueSoft" />
            ) : (
              <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-white/15" />
            )}
            <span className={idx <= phaseIdx ? 'text-brand-text/90' : 'text-brand-textMute'}>{ph}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── States 3 & 4 — the banner shown above the reused Profile / Settings tabs ─

export function SetupBanner({ step, onNext }: { step: 'profile' | 'settings'; onNext: () => void }) {
  const cfg =
    step === 'profile'
      ? {
          n: 2,
          label: 'Confirm your business',
          body: 'Here’s what rynk understood about you. Fix anything wrong and fill any blanks, then continue.',
          cta: 'Looks good — continue',
        }
      : {
          n: 3,
          label: 'Confirm publishing',
          body: 'Choose what rynk publishes automatically vs. what waits for your approval. Then we optimize.',
          cta: 'Confirm & optimize',
        };
  return (
    <div className={cn('mb-6 flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-brand-blue/25 sm:flex-row sm:items-center sm:justify-between')}>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">Setup · Step {cfg.n} of 3</p>
        <p className="mt-1 font-serif text-base text-brand-text">{cfg.label}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-brand-textMute">{cfg.body}</p>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 font-serif text-[15px] font-medium text-brand-ink transition-all hover:shadow-[0_12px_30px_-12px_rgba(255,255,255,0.4)]"
      >
        {cfg.cta}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
