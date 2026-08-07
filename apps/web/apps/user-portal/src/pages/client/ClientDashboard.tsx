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
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Eye, ExternalLink, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSampleClient, PUBLISH_TYPES, isActionAuto, type ClientData, type ActionItem } from './sampleData';
import { getArticle } from './sampleContent';
import { EditProvider, useEdit, SaveBar, EField, EText, EChips, ERowList } from './editable';
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

export function ClientDashboard(props: { backHref?: string; backLabel?: string }) {
  const { domain = 'fadelabbarbers.com' } = useParams();
  const client = useMemo(() => getSampleClient(domain), [domain]);
  // Key by client id so the edit draft resets when switching clients.
  return (
    <EditProvider key={client.id} client={client}>
      <ClientDashboardInner client={client} {...props} />
    </EditProvider>
  );
}

function ClientDashboardInner({
  client,
  backHref = '/preview',
  backLabel = 'all clients',
}: {
  client: ClientData;
  backHref?: string;
  backLabel?: string;
}) {
  const [tab, setTab] = useState<Tab>('Overview');
  const waiting = client.waitingOnYou.length;
  const { dirty, discard } = useEdit();

  // Guard tab switches when there are unsaved edits.
  function requestTab(next: Tab) {
    if (next === tab) return;
    if (dirty && !window.confirm('You have unsaved changes. Leave this tab without saving?\n\nUse “Save changes” at the bottom to keep them.')) {
      return;
    }
    if (dirty) discard();
    setTab(next);
  }

  // Guard leaving the page (reload / close) with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  return (
    <div className="pb-24 text-brand-text">
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
            onClick={() => requestTab(t)}
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
      {tab === 'Reports' && <Reports />}
      {tab === 'Profile' && <Profile />}
      {tab === 'Settings' && <Settings c={client} />}

      <SaveBar />
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
  const { draft } = useEdit();
  const pending = c.actions
    .filter((a) => a.status === 'needs_you' || a.status === 'in_review')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  // Publishing settings decide the split: manual types wait in the approval
  // queue; auto types are applied for the client and shown under Done.
  const needsApproval = pending.filter((a) => !isActionAuto(a, draft.autoPublish));
  const autoHandled = pending.filter((a) => isActionAuto(a, draft.autoPublish));
  const shipped = c.actions.filter((a) => a.status === 'shipped');
  const byChannel = groupBy([...shipped, ...autoHandled], (a) => a.channel);
  const remaining = needsApproval.length;

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

      {/* Approval queue — only the types set to manual; auto ones are applied. */}
      <ApprovalQueue items={needsApproval} autoCount={autoHandled.length} />

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

function ApprovalQueue({ items, autoCount = 0 }: { items: ActionItem[]; autoCount?: number }) {
  const [decided, setDecided] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [publishing, setPublishing] = useState<'idle' | 'publishing' | 'done'>('idle');

  const pending = items.filter((a) => !decided[a.id]);
  const approvedCount = Object.values(decided).filter((v) => v === 'approved').length;

  function decide(id: string, d: 'approved' | 'rejected') {
    setDecided((prev) => ({ ...prev, [id]: d }));
  }
  function publish() {
    setPublishing('publishing');
    // Real path: POST /client/:id/publish → runLayer4 applies the approved
    // actions. Simulated here in the sample preview.
    window.setTimeout(() => setPublishing('done'), 1400);
  }

  return (
    <section>
      <SectionHeading eyebrow="Nothing visible goes live without your OK" title={`Waiting for your approval${pending.length ? ` · ${pending.length}` : ''}`} />

      {autoCount > 0 && (
        <p className="-mt-3 mb-3 flex items-center gap-1.5 text-[12.5px] text-brand-textMute">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-emeraldSoft" />
          {autoCount} more handled automatically per your <span className="text-brand-text/80">Publishing settings</span> — see Done below.
        </p>
      )}

      {pending.length === 0 ? (
        <Panel><EmptyNote>All caught up — nothing waiting for sign-off.</EmptyNote></Panel>
      ) : (
        <div className="space-y-3">
          {pending.map((a) => (
            <Panel key={a.id} accent="via-brand-highlight">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <ChannelChip channel={a.channel} />
                    {a.impact && (
                      <span className="rounded-full bg-brand-emerald/12 px-2 py-0.5 font-mono text-[10px] text-brand-emeraldSoft ring-1 ring-brand-emerald/25">{a.impact}</span>
                    )}
                  </div>
                  <p className="mt-2 font-serif text-[15px] text-brand-text">{a.title}</p>
                  {a.detail && <p className="mt-0.5 text-[12.5px] text-brand-textMute">{a.detail}</p>}
                  {a.why && (
                    <p className="mt-2 border-l-2 border-brand-violet/40 pl-3 text-[12.5px] leading-relaxed text-brand-textMute">
                      <span className="text-brand-text/80">Why rynk recommends this:</span> {a.why}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button onClick={() => decide(a.id, 'approved')} className="rounded-full bg-white px-4 py-1 font-serif text-xs font-medium text-brand-ink">Approve</button>
                  <button className="rounded-full px-4 py-1 font-serif text-xs text-brand-text ring-1 ring-white/12">Edit</button>
                  <button onClick={() => decide(a.id, 'rejected')} className="rounded-full px-4 py-1 font-serif text-xs text-brand-textMute ring-1 ring-white/8">Reject</button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {approvedCount > 0 && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-brand-emerald/8 px-5 py-3 ring-1 ring-brand-emerald/20">
          <p className="text-sm text-brand-text">
            {publishing === 'done'
              ? `${approvedCount} approved change${approvedCount > 1 ? 's' : ''} published — rynk is rolling ${approvedCount > 1 ? 'them' : 'it'} out.`
              : `${approvedCount} approved · ready to publish`}
          </p>
          {publishing !== 'done' && (
            <button
              onClick={publish}
              disabled={publishing === 'publishing'}
              className="shrink-0 rounded-full bg-white px-5 py-1.5 font-serif text-sm font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)] disabled:opacity-60"
            >
              {publishing === 'publishing' ? 'Publishing…' : 'Publish approved'}
            </button>
          )}
        </div>
      )}
    </section>
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

function Reports() {
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

function Profile() {
  const { draft, update } = useEdit();
  const p = draft.profile;
  return (
    <div className="space-y-6">
      <Panel accent="via-brand-violet" className="bg-white/[0.015]">
        <p className="max-w-2xl text-sm leading-relaxed text-brand-textMute">
          <span className="text-brand-text">What rynk understands about your business.</span> Drafted from your website during onboarding — anything blank, we couldn't find. Edit anything inline; it steers the content rynk writes and the keywords it targets. Save from the bar at the bottom.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="What you do">
          <EField label="In a line" value={p.description} onChange={(v) => update((d) => { d.profile.description = v; })} />
          <EField label="The promise" value={p.valueProposition} onChange={(v) => update((d) => { d.profile.valueProposition = v; })} multiline />
        </PPanel>
        <PPanel title="What sets you apart">
          <EChips items={p.differentiators} onChange={(items) => update((d) => { d.profile.differentiators = items; })} />
        </PPanel>
        <PPanel title="Who you serve">
          <ERowList
            rows={p.personas}
            onChange={(rows) => update((d) => { d.profile.personas = rows; })}
            blank={() => ({ name: '', description: '' })}
            addLabel="Add a persona"
            render={(row, set) => (
              <div className="space-y-1">
                <EText value={row.name} onChange={(v) => set({ name: v })} placeholder="Name" />
                <EText value={row.description} onChange={(v) => set({ description: v })} placeholder="Who they are / what they need" />
              </div>
            )}
          />
        </PPanel>
        <PPanel title="How you sound">
          <EField label="Tone" value={p.voice.tone} onChange={(v) => update((d) => { d.profile.voice.tone = v; })} />
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Personality</p>
            <EChips items={p.voice.personality} onChange={(items) => update((d) => { d.profile.voice.personality = items; })} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Avoid</p>
            <EChips items={p.voice.avoid} onChange={(items) => update((d) => { d.profile.voice.avoid = items; })} tone="warn" />
          </div>
        </PPanel>
        <PPanel title="Topics we'll cover">
          <EChips items={p.contentThemes} onChange={(items) => update((d) => { d.profile.contentThemes = items; })} />
        </PPanel>
        <PPanel title="Products & services">
          <ERowList
            rows={p.products}
            onChange={(rows) => update((d) => { d.profile.products = rows; })}
            blank={() => ({ name: '', description: '' })}
            addLabel="Add a product / service"
            render={(row, set) => (
              <div className="space-y-1">
                <EText value={row.name} onChange={(v) => set({ name: v })} placeholder="Name" />
                <EText value={row.description} onChange={(v) => set({ description: v })} placeholder="Short description" />
              </div>
            )}
          />
        </PPanel>
      </div>

      <SectionHeading eyebrow="Presence" title="Where & how you operate" />
      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="Business details">
          <EField label="Category" value={p.primaryCategory} onChange={(v) => update((d) => { d.profile.primaryCategory = v; })} />
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Service areas</p>
            <EChips items={p.serviceAreas} onChange={(items) => update((d) => { d.profile.serviceAreas = items; })} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Markets</p>
            <EChips items={p.markets} onChange={(items) => update((d) => { d.profile.markets = items; })} />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-brand-textMute">Languages</p>
            <EChips items={p.languages} onChange={(items) => update((d) => { d.profile.languages = items; })} />
          </div>
          <EField label="Booking link" value={p.bookingUrl} onChange={(v) => update((d) => { d.profile.bookingUrl = v; })} />
        </PPanel>
        <PPanel title="Hours & services">
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-[11px] text-brand-textMute">Hours</p>
              <ERowList
                rows={p.hours}
                onChange={(rows) => update((d) => { d.profile.hours = rows; })}
                blank={() => ({ day: '', open: '', close: '' })}
                addLabel="Add hours"
                render={(row, set) => (
                  <div className="flex gap-2">
                    <EText value={row.day} onChange={(v) => set({ day: v })} placeholder="Day" />
                    <EText value={row.open} onChange={(v) => set({ open: v })} placeholder="Open" />
                    <EText value={row.close} onChange={(v) => set({ close: v })} placeholder="Close" />
                  </div>
                )}
              />
            </div>
            <div className="border-t border-white/8 pt-3">
              <p className="mb-1.5 text-[11px] text-brand-textMute">Services</p>
              <ERowList
                rows={p.services}
                onChange={(rows) => update((d) => { d.profile.services = rows; })}
                blank={() => ({ name: '', price: '' })}
                addLabel="Add a service"
                render={(row, set) => (
                  <div className="flex gap-2">
                    <EText value={row.name} onChange={(v) => set({ name: v })} placeholder="Service" />
                    <EText value={row.price} onChange={(v) => set({ price: v })} placeholder="Price" />
                  </div>
                )}
              />
            </div>
          </div>
        </PPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PPanel title="Review profiles">
          <ERowList
            rows={p.reviewProfiles}
            onChange={(rows) => update((d) => { d.profile.reviewProfiles = rows; })}
            blank={() => ({ platform: '', url: '' })}
            addLabel="Add a review profile"
            render={(row, set) => (
              <div className="flex gap-2">
                <EText value={row.platform} onChange={(v) => set({ platform: v })} placeholder="Platform" />
                <EText value={row.url} onChange={(v) => set({ url: v })} placeholder="URL" />
              </div>
            )}
          />
        </PPanel>
        <PPanel title="Writing guidelines">
          <EText value={p.guidelines} onChange={(v) => update((d) => { d.profile.guidelines = v; })} multiline placeholder="Any explicit brand or writing rules…" />
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

// ── Settings ─────────────────────────────────────────────────────────────────

function Settings({ c }: { c: ClientData }) {
  const { draft, update } = useEdit();
  const b = draft.business;
  const integrations = [
    { name: 'Website / CMS', status: 'Connected · WordPress', href: `https://${c.domain}/wp-admin`, cta: 'Manage in WordPress' },
    { name: 'Google Business Profile', status: c.kind === 'local' ? 'Connected' : 'Not applicable', href: 'https://business.google.com/', cta: 'Open Business Profile' },
    { name: 'Google Search Console', status: 'Not connected', href: `https://search.google.com/search-console?resource_id=sc-domain:${c.domain}`, cta: 'Open Search Console' },
    { name: 'Google Analytics', status: 'Not connected', href: 'https://analytics.google.com/', cta: 'Open Analytics' },
  ];
  const technical = PUBLISH_TYPES.filter((t) => t.group === 'technical');
  const content = PUBLISH_TYPES.filter((t) => t.group === 'content');
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Business info" />
        <div className="grid gap-3 sm:grid-cols-2">
          <EPanelField label="Name" value={b.name} onChange={(v) => update((d) => { d.business.name = v; })} />
          <Field label="Website" value={c.domain} />
          <EPanelField label="Industry" value={b.industry} onChange={(v) => update((d) => { d.business.industry = v; })} />
          <EPanelField label="Location" value={b.location} onChange={(v) => update((d) => { d.business.location = v; })} placeholder="City, State" />
        </div>
      </section>

      <section>
        <SectionHeading title="Integrations" />
        <Panel className="p-0">
          <div className="divide-y divide-white/6">
            {integrations.map((i) => {
              const connected = i.status.startsWith('Connected');
              return (
                <div key={i.name} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <span className="text-brand-text">{i.name}</span>
                    <span className={cn('ml-2 font-mono text-xs', connected ? 'text-brand-emeraldSoft' : 'text-brand-textMute')}>{i.status}</span>
                  </div>
                  {i.status === 'Not applicable' ? null : connected ? (
                    <a href={i.href} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-brand-blueSoft transition-colors hover:text-brand-text">
                      {i.cta} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button type="button" className="shrink-0 rounded-full bg-white/5 px-3 py-1 font-serif text-xs text-brand-text ring-1 ring-white/12">Connect</button>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
        <p className="mt-2 text-[12px] leading-relaxed text-brand-textMute">Deep links open each platform in a new tab so you can view your own data directly. Once connected, these metrics flow into your Overview.</p>
      </section>

      <section>
        <SectionHeading eyebrow="What publishes on its own vs. waits for you" title="Publishing" />
        <p className="-mt-3 mb-3 text-[13px] leading-relaxed text-brand-textMute">
          <span className="text-brand-text/80">Auto-publish</span> = rynk ships it for you and logs it under Done. <span className="text-brand-text/80">Needs approval</span> = rynk drafts it and it waits in your approval queue with the reasoning + estimated impact. Change any toggle and the queue updates to match.
        </p>

        <Panel className="mb-3">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-serif text-base font-medium text-brand-text">Technical SEO</h3>
            <span className="rounded-full bg-brand-emerald/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-brand-emeraldSoft ring-1 ring-brand-emerald/25">auto by default</span>
          </div>
          <p className="mb-4 text-[13px] text-brand-textMute">Behind-the-scenes fixes with no visible impact — on by default so they run automatically. Turn one off if you'd rather approve it first.</p>
          <div className="space-y-2.5">
            {technical.map((t) => {
              const on = draft.autoPublish[t.key] ?? t.defaultAuto;
              return (
                <label key={t.key} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text/90">{t.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className={cn('font-mono text-[11px]', on ? 'text-brand-emeraldSoft' : 'text-brand-textMute')}>{on ? 'Auto-publish' : 'Needs approval'}</span>
                    <Toggle on={on} onChange={(v) => update((d) => { d.autoPublish[t.key] = v; })} />
                  </div>
                </label>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <h3 className="font-serif text-base font-medium text-brand-text">Visible content — you decide</h3>
          <p className="mb-4 mt-1 text-[13px] text-brand-textMute">Anything that changes what visitors see — off by default (waits for your sign-off). Flip a type on to let rynk publish it automatically as you build trust.</p>
          <div className="space-y-2.5">
            {content.map((t) => {
              const on = draft.autoPublish[t.key] ?? t.defaultAuto;
              return (
                <label key={t.key} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text/90">{t.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className={cn('font-mono text-[11px]', on ? 'text-brand-emeraldSoft' : 'text-brand-textMute')}>{on ? 'Auto-publish' : 'Needs approval'}</span>
                    <Toggle on={on} onChange={(v) => update((d) => { d.autoPublish[t.key] = v; })} />
                  </div>
                </label>
              );
            })}
          </div>
        </Panel>
      </section>

      <NeedsData title="Team, roles & billing" detail="Team members + roles and plan/billing arrive with the accounts + billing layer." />
    </div>
  );
}

function Toggle({ defaultOn, on, onChange }: { defaultOn?: boolean; on?: boolean; onChange?: (v: boolean) => void }) {
  const [internal, setInternal] = useState(!!defaultOn);
  const isOn = on ?? internal;
  function toggle() {
    const next = !isOn;
    if (onChange) onChange(next);
    else setInternal(next);
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn('relative h-5 w-9 rounded-full transition-colors', isOn ? 'bg-brand-blue' : 'bg-white/12')}
    >
      <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', isOn ? 'left-[18px]' : 'left-0.5')} />
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

function EPanelField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Panel className="p-4">
      <p className="text-[11px] text-brand-textMute">{label}</p>
      <div className="mt-0.5">
        <EText value={value} onChange={onChange} placeholder={placeholder} />
      </div>
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
