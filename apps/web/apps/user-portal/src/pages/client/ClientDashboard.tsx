/**
 * Client dashboard — per-client view with the rynk tab structure:
 * Overview · Search Visibility · AI Visibility · Actions · Content · Reports · Settings
 *
 * Navy marketing vibe. Driven by the sample-data layer so the whole UI can be
 * tested before real data (GSC/GA, citation checker, AI citation tracker) is
 * wired. Client-type aware: `local` clients lead with Local Presence
 * (GBP / citations / reviews / map pack); `content` clients lead with keywords
 * and authority.
 */
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSampleClient, type ClientData, type ActionItem } from './sampleData';
import { getArticle } from './sampleContent';
import {
  Panel,
  SectionHeading,
  StatTile,
  Delta,
  StatusPill,
  ChannelChip,
  Meter,
  ScoreRing,
  LineChart,
  TrendArrow,
  PassBadge,
  NeedsData,
  EmptyNote,
} from './ui';

const TABS = ['Overview', 'Search Visibility', 'AI Visibility', 'Actions', 'Content', 'Reports', 'Profile', 'Settings'] as const;
type Tab = (typeof TABS)[number];

export function ClientDashboard({
  backHref = '/preview',
  backLabel = 'all clients',
}: {
  backHref?: string;
  backLabel?: string;
}) {
  const { domain = 'fadelabbarbers.com' } = useParams();
  const client = useMemo(() => getSampleClient(domain), [domain]);
  const [tab, setTab] = useState<Tab>('Overview');
  const waiting = client.waitingOnYou.length;

  return (
    <div className="text-brand-text">
      {/* Back to the company list — left-aligned above the client title. */}
      <Link
        to={backHref}
        className="mb-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-blueSoft transition-colors hover:text-brand-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>

      {/* Client context header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">Client</p>
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">
              {client.plan}
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">
              {client.kind === 'local' ? 'Local business' : 'Content / B2B'}
            </span>
          </div>
          <h1 className="mt-1.5 font-serif text-3xl font-medium tracking-tight">{client.name}</h1>
          <p className="mt-0.5 font-mono text-xs text-brand-textMute">
            {client.domain}
            {client.location ? ` · ${client.location}` : ''} · {client.industry}
          </p>
        </div>
        <button
          type="button"
          className="relative rounded-lg p-2 text-brand-textMute ring-1 ring-white/10 transition-colors hover:text-brand-text"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {waiting > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-highlight px-1 text-[9px] font-medium text-brand-ink">
              {waiting}
            </span>
          )}
        </button>
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex gap-7 overflow-x-auto border-b border-white/8">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'whitespace-nowrap border-b-2 pb-2.5 font-serif text-[15px] transition-colors',
              tab === t ? 'border-brand-blue text-brand-text' : 'border-transparent text-brand-textMute hover:text-brand-text',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Overview c={client} onSeeActions={() => setTab('Actions')} />}
      {tab === 'Search Visibility' && <SearchVisibility c={client} />}
      {tab === 'AI Visibility' && <AIVisibility c={client} />}
      {tab === 'Actions' && <Actions c={client} />}
      {tab === 'Content' && <Content c={client} />}
      {tab === 'Reports' && <Reports c={client} />}
      {tab === 'Profile' && <Profile c={client} />}
      {tab === 'Settings' && <Settings c={client} />}
    </div>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────────

function Overview({ c, onSeeActions }: { c: ClientData; onSeeActions: () => void }) {
  const scoreDelta = c.visibilityScore.today - c.visibilityScore.baseline;
  const recent = [...c.actions]
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .filter((a) => a.status !== 'shipped' || a.date)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Score + chart */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel className="flex items-center gap-6">
          <ScoreRing score={c.visibilityScore.today} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">Visibility Score</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-textMute">
              One number rolling up rankings, AI citations, and authority.
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-xs text-brand-textMute">Day 0 baseline {c.visibilityScore.baseline}</span>
              <Delta value={scoreDelta} goodDirection="up" />
            </div>
          </div>
        </Panel>
        <Panel>
          <SectionHeading title="Visibility over time" updated={c.lastUpdated} />
          <LineChart data={c.visibilityScore.series} />
        </Panel>
      </div>

      {/* Progress table */}
      <section>
        <SectionHeading eyebrow="Results, not activity" title="Progress vs. Day 0" updated={c.lastUpdated} />
        <Panel className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-textMute">
                  <th className="px-5 py-3 text-left font-normal">Metric</th>
                  {['Day 0', 'Day 30', 'Day 60', 'Day 90', 'Today'].map((h) => (
                    <th key={h} className="px-4 py-3 text-right font-normal">{h}</th>
                  ))}
                  <th className="px-5 py-3 text-right font-normal">Since Day 0</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {c.progress.map((r) => (
                  <tr key={r.label} className="transition-colors hover:bg-white/[0.015]">
                    <td className="px-5 py-3 text-brand-text">{r.label}</td>
                    {[r.day0, r.day30, r.day60, r.day90].map((v, i) => (
                      <td key={i} className="px-4 py-3 text-right font-mono text-brand-textMute">{fmt(v)}</td>
                    ))}
                    <td className="px-4 py-3 text-right font-mono text-brand-text">{fmt(r.today)}</td>
                    <td className="px-5 py-3 text-right">
                      <TrendArrow from={num(r.day0)} to={num(r.today)} goodDirection={r.goodDirection} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <p className="mt-2 text-xs text-brand-textMute">Day 0 is the snapshot frozen at onboarding — every before/after compares to it. It never moves.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent activity */}
        <section>
          <SectionHeading
            title="Recent activity"
            action={
              <button onClick={onSeeActions} className="font-mono text-[11px] text-brand-blueSoft hover:text-brand-text">
                view all →
              </button>
            }
          />
          <Panel className="p-0">
            <div className="divide-y divide-white/6">
              {recent.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChannelChip channel={a.channel} />
                      {a.date && <span className="font-mono text-[10px] text-brand-textMute">{a.date}</span>}
                    </div>
                    <p className="mt-1 truncate text-sm text-brand-text">{a.title}</p>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Insights + waiting */}
        <section className="space-y-4">
          <div>
            <SectionHeading title="Insights" />
            <Panel accent="via-brand-violet">
              <ul className="space-y-3">
                {c.insights.map((t, i) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-brand-text/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violetSoft" />
                    {t}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
          {c.waitingOnYou.length > 0 && (
            <div>
              <SectionHeading title="Waiting on you" />
              <Panel accent="via-brand-highlight" className="p-0">
                <div className="divide-y divide-white/6">
                  {c.waitingOnYou.map((w) => (
                    <div key={w.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div>
                        <p className="text-sm text-brand-text">{w.label}</p>
                        <p className="text-[11px] text-brand-textMute">{w.detail}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button className="rounded-full bg-white px-3 py-1 font-serif text-xs font-medium text-brand-ink">Approve</button>
                        <button className="rounded-full px-3 py-1 font-serif text-xs text-brand-textMute ring-1 ring-white/12">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Search Visibility ────────────────────────────────────────────────────────

function SearchVisibility({ c }: { c: ClientData }) {
  const local = c.kind === 'local' && c.local ? <LocalPresence c={c} /> : null;
  return (
    <div className="space-y-8">
      {/* Local clients lead with Local Presence */}
      {c.kind === 'local' && local}

      <section>
        <SectionHeading eyebrow="Search Console + Analytics" title="Traffic & engagement" />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Impressions" value={c.traffic.impressions.toLocaleString()} delta={pct(c.traffic.impressions, c.traffic.impressions30)} goodDirection="up" hint="Times you showed up in search results." />
          <StatTile label="Clicks" value={c.traffic.clicks.toLocaleString()} delta={pct(c.traffic.clicks, c.traffic.clicks30)} goodDirection="up" hint="People who actually visited." />
          <StatTile label="CTR" value={`${c.traffic.ctr}%`} hint="Clicks ÷ impressions. Low CTR + high impressions = rewrite the listing." />
        </div>
      </section>

      <section>
        <SectionHeading title="Keywords" />
        <Panel className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-textMute">
                  <th className="px-5 py-3 text-left font-normal">Keyword</th>
                  <th className="px-4 py-3 text-right font-normal">Rank</th>
                  <th className="px-4 py-3 text-right font-normal">30d ago</th>
                  <th className="px-4 py-3 text-right font-normal">Trend</th>
                  <th className="px-4 py-3 text-right font-normal">Volume</th>
                  <th className="px-5 py-3 text-right font-normal">Top competitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {c.keywords.map((k) => {
                  const best = Object.entries(k.competitors).filter(([, v]) => v != null).sort((a, b) => (a[1] as number) - (b[1] as number))[0];
                  return (
                    <tr key={k.term} className="transition-colors hover:bg-white/[0.015]">
                      <td className="px-5 py-3 text-brand-text">{k.term}</td>
                      <td className="px-4 py-3 text-right font-mono">{k.rank ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-brand-textMute">{k.rank30 ?? '—'}</td>
                      <td className="px-4 py-3 text-right"><TrendArrow from={k.rank30} to={k.rank} goodDirection="down" /></td>
                      <td className="px-4 py-3 text-right font-mono text-brand-textMute">{k.volume.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-mono text-[11px] text-brand-textMute">{best ? `${best[0]} #${best[1]}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <section>
        <SectionHeading title="Authority & site health" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Domain Authority" value={c.authority.da} hint="How much Google trusts your domain (0–100)." />
          <StatTile label="Backlinks" value={c.authority.backlinks.toLocaleString()} hint="External links pointing to you — each a vote of trust." />
          <StatTile label="Referring domains" value={c.authority.referringDomains.toLocaleString()} />
          <Panel className="p-4">
            <p className="text-[12px] text-brand-textMute">Core Web Vitals</p>
            <div className="mt-3 space-y-2">
              {(['lcp', 'cls', 'inp'] as const).map((k) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase text-brand-textMute">{k}</span>
                  <PassBadge status={c.coreWebVitals[k]} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      {/* Content clients get Local Presence last (or not at all) */}
      {c.kind !== 'local' && (
        <p className="text-xs text-brand-textMute">Local presence (Google Business Profile, citations, map pack) is shown for local-business clients.</p>
      )}
    </div>
  );
}

function LocalPresence({ c }: { c: ClientData }) {
  const l = c.local!;
  return (
    <section>
      <SectionHeading eyebrow="Where local customers find you" title="Local presence" />
      <div className="grid gap-4 md:grid-cols-2">
        {/* GBP */}
        <Panel accent="via-brand-emerald">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-medium">Google Business Profile</h3>
            <span className="font-mono text-xs text-brand-emeraldSoft">{l.gbp.completeness}% complete</span>
          </div>
          <div className="mt-3"><Meter value={l.gbp.completeness} tone="emerald" /></div>
          <ul className="mt-4 space-y-1.5 text-[13px]">
            <Check ok={l.gbp.claimed}>Profile claimed</Check>
            <Check ok={l.gbp.hoursCorrect}>Hours accurate</Check>
            <Check ok={l.gbp.bookingLink}>Booking link connected</Check>
          </ul>
        </Panel>

        {/* Map pack */}
        <Panel accent="via-brand-blue">
          <h3 className="font-serif text-base font-medium">Map pack ranking</h3>
          <p className="mt-1 text-[11px] text-brand-textMute">Your rank in Google's local 3-pack.</p>
          <div className="mt-3 space-y-2.5">
            <MapRow label={l.mapPack.primary.category} rank={l.mapPack.primary.rank} primary />
            {l.mapPack.secondary.map((s) => (
              <MapRow key={s.category} label={s.category} rank={s.rank} />
            ))}
          </div>
        </Panel>

        {/* Citations */}
        <Panel accent="via-brand-cyan">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-medium">Directory citations</h3>
            <span className="font-mono text-xs text-brand-cyanSoft">{l.citations.consistent}/{l.citations.total} consistent</span>
          </div>
          <p className="mt-1 text-[11px] text-brand-textMute">Your name, address & phone must match everywhere.</p>
          <ul className="mt-3 space-y-1.5 text-[13px]">
            {l.citations.issues.map((issue) => (
              <li key={issue} className="flex items-center gap-2 text-brand-textMute">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-highlight" /> {issue}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Reviews */}
        <Panel accent="via-brand-amber">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-medium">Reviews</h3>
            <span className="font-mono text-sm text-brand-amberSoft">{l.reviews.avg}★ · {l.reviews.count}</span>
          </div>
          <div className="mt-2 -mx-2"><LineChart data={l.reviews.series} height={70} /></div>
          {l.reviews.unreplied > 0 && (
            <p className="mt-1 text-[12px] text-brand-highlight">{l.reviews.unreplied} unreplied — drafts ready in Actions.</p>
          )}
        </Panel>
      </div>
    </section>
  );
}

function MapRow({ label, rank, primary }: { label: string; rank: number | null; primary?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn('text-[13px]', primary ? 'text-brand-text' : 'text-brand-textMute')}>{label}</span>
      <span className="font-mono text-sm">
        {rank == null ? <span className="text-brand-textMute">not ranking</span> : <span className={rank <= 3 ? 'text-brand-emeraldSoft' : 'text-brand-text'}>#{rank}</span>}
      </span>
    </div>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn('flex h-4 w-4 items-center justify-center rounded-full text-[10px]', ok ? 'bg-brand-emerald/15 text-brand-emeraldSoft' : 'bg-brand-highlight/15 text-brand-highlight')}>
        {ok ? '✓' : '!'}
      </span>
      <span className={ok ? 'text-brand-text/90' : 'text-brand-textMute'}>{children}</span>
    </li>
  );
}

// ── AI Visibility ────────────────────────────────────────────────────────────

function AIVisibility({ c }: { c: ClientData }) {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-brand-textMute">
        When someone asks ChatGPT, Perplexity, or Google's AI Overview a question in your space, this is whether it names{' '}
        <span className="text-brand-text">you</span>. Tracked per-platform, never combined — citations now vs. Day 0, which queries trigger a mention, and who gets cited when you don't.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {c.ai.map((p) => (
          <Panel key={p.platform} accent="via-brand-violet">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-base font-medium">{p.platform}</h3>
              <Delta value={p.now - p.baseline} goodDirection="up" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl tracking-tight">{p.now}</span>
              <span className="text-xs text-brand-textMute">citations · was {p.baseline} at Day 0</span>
            </div>
            <div className="mt-4 space-y-2 border-t border-white/8 pt-3">
              {p.queries.map((q) => (
                <div key={q.q} className="text-[12.5px]">
                  <div className="flex items-start gap-2">
                    <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', q.cited ? 'bg-brand-emeraldSoft' : 'bg-white/20')} />
                    <span className={q.cited ? 'text-brand-text/90' : 'text-brand-textMute'}>{q.q}</span>
                  </div>
                  {!q.cited && q.competitorCited && (
                    <p className="ml-3.5 font-mono text-[10px] text-brand-textMute">{q.competitorCited} cited instead</p>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ── Actions ──────────────────────────────────────────────────────────────────

function Actions({ c }: { c: ClientData }) {
  const needsYou = c.actions.filter((a) => a.status === 'needs_you' || a.status === 'in_review').sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  const shipped = c.actions.filter((a) => a.status === 'shipped');
  const byChannel = groupBy(shipped, (a) => a.channel);
  const remaining = needsYou.length;

  return (
    <div className="space-y-8">
      {/* Money view: what changed, grouped */}
      <section>
        <SectionHeading eyebrow="What rynk shipped" title={`${shipped.length} fixes live · ${remaining} waiting on you`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(byChannel).map(([ch, items]) => (
            <Panel key={ch} className="p-4">
              <div className="flex items-center justify-between">
                <ChannelChip channel={ch} />
                <span className="font-serif text-2xl">{items.length}</span>
              </div>
              <p className="mt-1.5 text-[12px] leading-snug text-brand-textMute">{channelLabel(ch)}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Waiting on you — prioritized, always on top */}
      <section>
        <SectionHeading title="Waiting on you" />
        {needsYou.length === 0 ? (
          <Panel><EmptyNote>Nothing needs your sign-off right now.</EmptyNote></Panel>
        ) : (
          <Panel accent="via-brand-highlight" className="p-0">
            <div className="divide-y divide-white/6">
              {needsYou.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChannelChip channel={a.channel} />
                      <StatusPill status={a.status} />
                    </div>
                    <p className="mt-1.5 text-sm text-brand-text">{a.title}</p>
                    {a.detail && <p className="mt-0.5 text-[12px] text-brand-textMute">{a.detail}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button className="rounded-full bg-white px-3 py-1 font-serif text-xs font-medium text-brand-ink">Approve</button>
                    <button className="rounded-full px-3 py-1 font-serif text-xs text-brand-textMute ring-1 ring-white/12">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </section>

      {/* Done by rynk — grouped, collapsible by channel */}
      <section>
        <SectionHeading title="Done by rynk" />
        <div className="space-y-2">
          {Object.entries(byChannel).map(([ch, items]) => (
            <ActionGroup key={ch} channel={ch} items={items} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ActionGroup({ channel, items }: { channel: string; items: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Panel className="p-0">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-3 text-left">
        <div className="flex items-center gap-2.5">
          <ChannelChip channel={channel} />
          <span className="text-sm text-brand-text">{channelLabel(channel)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-brand-textMute">{items.length}</span>
          <span className="font-mono text-xs text-brand-textMute">{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && (
        <div className="divide-y divide-white/6 border-t border-white/8">
          {items.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-[13px] text-brand-text/90">{a.title}</p>
                {a.before && a.after && (
                  <p className="mt-0.5 font-mono text-[10px] text-brand-textMute">{a.before} → {a.after}</p>
                )}
              </div>
              <span className="shrink-0 font-mono text-[10px] text-brand-textMute">{a.date}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ── Content ──────────────────────────────────────────────────────────────────

function Content({ c }: { c: ClientData }) {
  return (
    <div className="space-y-6">
      <Panel accent="via-brand-blue" className="bg-white/[0.015]">
        <p className="max-w-3xl text-sm leading-relaxed text-brand-textMute">
          <span className="text-brand-text">How publishing works:</span> reversible technical fixes (meta, schema, links, speed) go live automatically. Anything public — new pages, GBP posts, review replies, outreach — waits for your one-click approval below. You can flip individual types to auto-publish in Settings once you trust them. Everything is logged either way.
        </p>
      </Panel>

      <section>
        <SectionHeading title={`${c.drafts.length} drafts to review`} />
        {c.drafts.length === 0 ? (
          <Panel><EmptyNote>No drafts to review yet.</EmptyNote></Panel>
        ) : (
          <div className="space-y-3">
            {c.drafts.map((d) => (
              <Panel key={d.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChannelChip channel={d.channel} />
                      <span className="font-mono text-[10px] uppercase tracking-wide text-brand-textMute">{d.kind.replace('_', ' ')}</span>
                      {d.words && <span className="font-mono text-[10px] text-brand-textMute">{d.words} words</span>}
                    </div>
                    <h3 className="mt-1.5 font-serif text-base font-medium text-brand-text">{d.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-brand-textMute">{d.preview}</p>
                    {getArticle(d.id) && (
                      <Link
                        to={`/preview/content/${d.id}`}
                        className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-blueSoft transition-colors hover:text-brand-text"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview page
                      </Link>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button className="rounded-full bg-white px-4 py-1 font-serif text-xs font-medium text-brand-ink">Approve</button>
                    <button className="rounded-full px-4 py-1 font-serif text-xs text-brand-text ring-1 ring-white/12">Edit</button>
                    <button className="rounded-full px-4 py-1 font-serif text-xs text-brand-textMute ring-1 ring-white/8">Reject</button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ── Reports ──────────────────────────────────────────────────────────────────

function Reports({ c }: { c: ClientData }) {
  const weeks = ['Week of Jun 23', 'Week of Jun 16', 'Week of Jun 9', 'Week of Jun 2'];
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading eyebrow="The history" title="Weekly digests" />
        <Panel className="p-0">
          <div className="divide-y divide-white/6">
            {weeks.map((w, i) => (
              <div key={w} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-brand-text">{w}</p>
                  <p className="text-[11px] text-brand-textMute">
                    {i === 0 ? 'Visibility +6 · 3 fixes shipped · 2 reviews replied' : 'Visibility, rankings & actions summary'}
                  </p>
                </div>
                <button className="font-mono text-[11px] text-brand-blueSoft hover:text-brand-text">open →</button>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section>
        <SectionHeading title="Monthly summary (PDF)" />
        <Panel className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text">June 2026 summary</p>
            <p className="text-[11px] text-brand-textMute">Auto-generated PDF for clients who don't log in often.</p>
          </div>
          <button className="rounded-full bg-white px-4 py-1.5 font-serif text-xs font-medium text-brand-ink">Download PDF</button>
        </Panel>
      </section>

      <NeedsData
        title="Business outcome — estimated added visits (unlocks at 3 months)"
        detail={`Once there's ${'≥'}3 months of history we show estimated additional visits attributable to rynk — visits above the Day 0 baseline trend, labelled "estimated," never claimed as hard causation.`}
      />
    </div>
  );
}

// ── Profile ──────────────────────────────────────────────────────────────────

function Profile({ c }: { c: ClientData }) {
  const p = c.profile;
  const canEdit = true; // RBAC: owner/admin only (stubbed on for preview)
  return (
    <div className="space-y-6">
      <Panel accent="via-brand-violet" className="flex items-start justify-between gap-4 bg-white/[0.015]">
        <p className="max-w-2xl text-sm leading-relaxed text-brand-textMute">
          <span className="text-brand-text">What rynk understands about your business.</span> Drafted from your website during onboarding — anything blank, we couldn't find. Edit anything; it steers the content rynk writes and the keywords it targets.
        </p>
        {canEdit && <button className="shrink-0 rounded-full bg-white px-4 py-1.5 font-serif text-xs font-medium text-brand-ink">Edit</button>}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="What you do">
          <PField label="In a line" value={p.description} />
          <PField label="The promise" value={p.valueProposition} />
        </PPanel>
        <PPanel title="What sets you apart">
          <PChips items={p.differentiators} />
        </PPanel>
        <PPanel title="Who you serve">
          {p.personas.length === 0 ? <NotSet /> : (
            <div className="space-y-3">
              {p.personas.map((x) => (
                <div key={x.name}>
                  <p className="text-sm text-brand-text">{x.name}</p>
                  <p className="text-[12.5px] leading-relaxed text-brand-textMute">{x.description}</p>
                </div>
              ))}
            </div>
          )}
        </PPanel>
        <PPanel title="How you sound">
          <PField label="Tone" value={p.voice.tone} />
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Personality</p>
            <PChips items={p.voice.personality} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Avoid</p>
            <PChips items={p.voice.avoid} tone="warn" />
          </div>
        </PPanel>
        <PPanel title="Topics we'll cover">
          <PChips items={p.contentThemes} />
        </PPanel>
        <PPanel title="Products & services">
          {p.products.length === 0 ? <NotSet /> : (
            <div className="space-y-2.5">
              {p.products.map((x) => (
                <div key={x.name}>
                  <p className="text-sm text-brand-text">{x.name}</p>
                  <p className="text-[12.5px] leading-relaxed text-brand-textMute">{x.description}</p>
                </div>
              ))}
            </div>
          )}
        </PPanel>
      </div>

      <SectionHeading eyebrow="Presence" title="Where & how you operate" />
      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="Business details">
          <PField label="Category" value={p.primaryCategory} />
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Service areas</p>
            <PChips items={p.serviceAreas} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Markets</p>
            <PChips items={p.markets} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Languages</p>
            <PChips items={p.languages} />
          </div>
          <PField label="Booking link" value={p.bookingUrl} />
        </PPanel>
        <PPanel title="Hours & services">
          {p.hours.length === 0 && p.services.length === 0 ? (
            <NotSet />
          ) : (
            <div className="space-y-4">
              {p.hours.length > 0 && (
                <div className="space-y-1">
                  {p.hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-[13px]">
                      <span className="text-brand-textMute">{h.day}</span>
                      <span className="font-mono text-brand-text/90">{h.open}–{h.close}</span>
                    </div>
                  ))}
                </div>
              )}
              {p.services.length > 0 && (
                <div className="space-y-1 border-t border-white/8 pt-3">
                  {p.services.map((s) => (
                    <div key={s.name} className="flex justify-between text-[13px]">
                      <span className="text-brand-text/90">{s.name}</span>
                      <span className="font-mono text-brand-text">{s.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </PPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="Review profiles">
          {p.reviewProfiles.length === 0 ? (
            <NotSet />
          ) : (
            <div className="flex flex-wrap gap-2">
              {p.reviewProfiles.map((r) => (
                <span key={r.platform} className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-brand-text/90 ring-1 ring-white/10">{r.platform}</span>
              ))}
            </div>
          )}
        </PPanel>
        <PPanel title="Writing guidelines">
          <PField label="" value={p.guidelines} />
        </PPanel>
      </div>
    </div>
  );
}

function PPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel>
      <h3 className="font-serif text-base font-medium text-brand-text">{title}</h3>
      <div className="mt-3">{children}</div>
    </Panel>
  );
}

function PField({ label, value }: { label: string; value: string }) {
  return (
    <div className={label ? 'mt-3 first:mt-0' : ''}>
      {label && <p className="mb-0.5 text-[11px] text-brand-textMute">{label}</p>}
      {value ? <p className="text-sm leading-relaxed text-brand-text/90">{value}</p> : <NotSet />}
    </div>
  );
}

function PChips({ items, tone }: { items: string[]; tone?: 'warn' }) {
  if (items.length === 0) return <NotSet />;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((x) => (
        <span
          key={x}
          className={cn(
            'rounded-full px-2.5 py-1 text-[12px] ring-1',
            tone === 'warn' ? 'bg-brand-highlight/10 text-brand-highlight ring-brand-highlight/25' : 'bg-white/5 text-brand-text/90 ring-white/10',
          )}
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function NotSet() {
  return <span className="text-[13px] italic text-brand-textMute/70">Not set yet</span>;
}

// ── Settings ─────────────────────────────────────────────────────────────────

function Settings({ c }: { c: ClientData }) {
  const integrations = [
    { name: 'Website / CMS', status: 'Connected · WordPress' },
    { name: 'Google Business Profile', status: c.kind === 'local' ? 'Connected' : 'Not applicable' },
    { name: 'Google Search Console', status: 'Not connected' },
    { name: 'Google Analytics', status: 'Not connected' },
  ];
  const autoTypes = ['Meta titles & descriptions', 'Schema markup', 'Internal links', 'Image alt text'];
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Business info" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={c.name} />
          <Field label="Website" value={c.domain} />
          <Field label="Industry" value={c.industry} />
          <Field label="Location" value={c.location ?? '—'} />
        </div>
      </section>

      <section>
        <SectionHeading title="Integrations" />
        <Panel className="p-0">
          <div className="divide-y divide-white/6">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-brand-text">{i.name}</span>
                <span className={cn('font-mono text-xs', i.status.startsWith('Connected') ? 'text-brand-emeraldSoft' : 'text-brand-textMute')}>{i.status}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section>
        <SectionHeading title="Auto-publish trusted types" />
        <Panel>
          <p className="mb-4 text-[13px] text-brand-textMute">Let rynk publish these without waiting for approval. Public content (pages, posts, outreach, review replies) always needs sign-off.</p>
          <div className="space-y-2.5">
            {autoTypes.map((t, i) => (
              <label key={t} className="flex items-center justify-between text-sm">
                <span className="text-brand-text/90">{t}</span>
                <Toggle defaultOn={i < 3} />
              </label>
            ))}
          </div>
        </Panel>
      </section>

      <NeedsData title="Team, roles & billing" detail="Team members + roles and plan/billing arrive with the accounts + billing layer." />
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((o) => !o)}
      className={cn('relative h-5 w-9 rounded-full transition-colors', on ? 'bg-brand-blue' : 'bg-white/12')}
    >
      <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', on ? 'left-[18px]' : 'left-0.5')} />
    </button>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Panel className="p-4">
      <p className="text-[11px] text-brand-textMute">{label}</p>
      <p className="mt-0.5 text-sm text-brand-text">{value}</p>
    </Panel>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number | string | null): string {
  if (v == null) return '—';
  return typeof v === 'number' ? v.toLocaleString() : v;
}
function num(v: number | string | null): number | null {
  return typeof v === 'number' ? v : null;
}
function pct(now: number, prev: number): number {
  if (!prev) return 0;
  return Math.round(((now - prev) / prev) * 100);
}
function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
function channelLabel(ch: string): string {
  const map: Record<string, string> = {
    cms: 'Website pages & meta',
    gbp: 'Google Business Profile',
    citations: 'Directory listings',
    reviews: 'Reviews',
    image: 'Images & alt text',
    outreach: 'Backlink outreach',
    social: 'Social / brand posts',
    'code-pr': 'Code fixes',
    document: 'Documents',
    schema: 'Structured data',
  };
  return map[ch] ?? ch;
}
