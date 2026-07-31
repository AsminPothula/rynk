/**
 * Navy dashboard primitives — the shared building blocks for the client
 * dashboard, styled to match the rynk.ai marketing site (dark navy surfaces,
 * Fraunces serif headings, Geist body/mono, muted violet-blue accents).
 *
 * Charts are hand-drawn SVG so there's no charting dependency.
 */
import { cn } from '@/lib/utils';
import type { TrendPoint } from './sampleData';

// ── surfaces ─────────────────────────────────────────────────────────────────

export function Panel({
  className,
  accent,
  children,
}: {
  className?: string;
  accent?: string; // tailwind gradient via-* color for the top hairline
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 p-5',
        className,
      )}
    >
      {accent && (
        <div
          aria-hidden
          className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent', accent)}
        />
      )}
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  updated,
  action,
}: {
  eyebrow?: string;
  title: string;
  updated?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-serif text-xl font-medium tracking-tight text-brand-text">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {updated && <span className="whitespace-nowrap font-mono text-[10px] text-brand-textMute">updated {updated}</span>}
        {action}
      </div>
    </div>
  );
}

// ── numbers ──────────────────────────────────────────────────────────────────

export function Delta({ value, goodDirection = 'up', suffix = '' }: { value: number; goodDirection?: 'up' | 'down'; suffix?: string }) {
  if (value === 0) return <span className="font-mono text-xs text-brand-textMute">—</span>;
  const positive = goodDirection === 'up' ? value > 0 : value < 0;
  const arrow = value > 0 ? '↑' : '↓';
  return (
    <span className={cn('font-mono text-xs', positive ? 'text-brand-emeraldSoft' : 'text-brand-pinkSoft')}>
      {arrow} {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function StatTile({
  label,
  value,
  delta,
  goodDirection,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  goodDirection?: 'up' | 'down';
  hint?: string;
}) {
  return (
    <Panel className="p-4">
      <p className="text-[12px] text-brand-textMute">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-serif text-[26px] leading-none tracking-tight text-brand-text">{value}</span>
        {delta !== undefined && <Delta value={delta} goodDirection={goodDirection} />}
      </div>
      {hint && <p className="mt-1.5 text-[11px] leading-snug text-brand-textMute">{hint}</p>}
    </Panel>
  );
}

// ── pills / chips ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  shipped: 'bg-brand-blue/12 text-brand-blueSoft ring-brand-blue/25',
  in_review: 'bg-brand-violet/12 text-brand-violetSoft ring-brand-violet/25',
  queued: 'bg-white/5 text-brand-textMute ring-white/10',
  scheduled: 'bg-brand-cyan/12 text-brand-cyanSoft ring-brand-cyan/25',
  needs_you: 'bg-brand-highlight/15 text-brand-highlight ring-brand-highlight/30',
};
const STATUS_LABELS: Record<string, string> = {
  shipped: 'shipped',
  in_review: 'in review',
  queued: 'queued',
  scheduled: 'scheduled',
  needs_you: 'needs you',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn('shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ring-1', STATUS_STYLES[status] ?? STATUS_STYLES.queued)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const CHANNEL_STYLES: Record<string, string> = {
  cms: 'text-brand-blueSoft',
  gbp: 'text-brand-emeraldSoft',
  citations: 'text-brand-cyanSoft',
  reviews: 'text-brand-amberSoft',
  image: 'text-brand-violetSoft',
  outreach: 'text-brand-emeraldSoft',
  social: 'text-brand-pinkSoft',
  'code-pr': 'text-brand-cyanSoft',
  document: 'text-brand-highlight',
  schema: 'text-brand-blueSoft',
};

export function ChannelChip({ channel }: { channel: string }) {
  return (
    <span className={cn('rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]', CHANNEL_STYLES[channel] ?? 'text-brand-textMute')}>
      {channel}
    </span>
  );
}

// ── bars ─────────────────────────────────────────────────────────────────────

export function Meter({ value, tone = 'blue' }: { value: number; tone?: 'blue' | 'emerald' | 'amber' }) {
  const bar = tone === 'emerald' ? 'bg-brand-emerald' : tone === 'amber' ? 'bg-brand-amber' : 'bg-brand-blue';
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div className={cn('h-full rounded-full', bar)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

// ── score ring ───────────────────────────────────────────────────────────────

export function ScoreRing({ score, size = 132 }: { score: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6d8dff" />
            <stop offset="100%" stopColor="#9c8cf0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl leading-none tracking-tight text-brand-text">{score}</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-textMute">/ 100</span>
      </div>
    </div>
  );
}

// ── line chart ───────────────────────────────────────────────────────────────

export function LineChart({ data, height = 140 }: { data: TrendPoint[]; height?: number }) {
  const w = 640;
  const pad = 6;
  const vals = data.map((d) => d.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (d.v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `${pad},${height - pad} ${line} ${w - pad},${height - pad}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(109,141,255,0.25)" />
          <stop offset="100%" stopColor="rgba(109,141,255,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={line} fill="none" stroke="#8fa8ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.5} fill="#c4b8ff" />}
    </svg>
  );
}

// ── misc ─────────────────────────────────────────────────────────────────────

export function TrendArrow({ from, to, goodDirection = 'up' }: { from: number | null; to: number | null; goodDirection?: 'up' | 'down' }) {
  if (from == null || to == null) return <span className="text-brand-textMute">—</span>;
  const diff = to - from;
  if (diff === 0) return <span className="font-mono text-xs text-brand-textMute">—</span>;
  const improved = goodDirection === 'up' ? diff > 0 : diff < 0;
  return (
    <span className={cn('font-mono text-xs', improved ? 'text-brand-emeraldSoft' : 'text-brand-pinkSoft')}>
      {diff > 0 ? '↑' : '↓'} {Math.abs(diff)}
    </span>
  );
}

export function PassBadge({ status }: { status: 'pass' | 'needs-work' }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 font-mono text-[10px] ring-1',
        status === 'pass' ? 'bg-brand-emerald/12 text-brand-emeraldSoft ring-brand-emerald/25' : 'bg-brand-highlight/15 text-brand-highlight ring-brand-highlight/30',
      )}
    >
      {status === 'pass' ? 'pass' : 'needs work'}
    </span>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-8 text-center text-sm text-brand-textMute">{children}</div>;
}

export function NeedsData({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.015] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-textMute">Not tracked yet</p>
      <h3 className="mt-2 font-serif text-lg font-medium text-brand-text">{title}</h3>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-brand-textMute">{detail}</p>
    </div>
  );
}
