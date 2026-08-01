/**
 * Client detail — the per-client dashboard with the rynk tab structure:
 * Overview · Search Visibility · AI Visibility · Actions · Content · Reports · Settings
 *
 * Tabs backed by real backend data (audit authority, execution manifest) are
 * populated; tabs that need data the pipeline doesn't collect yet
 * (composite score / baseline time-series / AI citations / reports) show an
 * honest "not tracked yet" state rather than fabricated numbers.
 */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetClientOverview } from '@shared/hooks/rq/queries/useGetClientOverview';

const TABS = [
  'Overview',
  'Search Visibility',
  'AI Visibility',
  'Actions',
  'Content',
  'Reports',
  'Settings',
] as const;
type Tab = (typeof TABS)[number];

const CONTENT_TYPES = [
  'create_page',
  'draft_outreach',
  'draft_brand_post',
  'create_document',
];

export function ClientDetail() {
  const { domain = '' } = useParams();
  const { data: ov, isLoading } = useGetClientOverview(domain);
  const [tab, setTab] = useState<Tab>('Overview');

  const audit = ov?.latestAudit ?? null;
  const manifest = ov?.latestManifest ?? null;
  const authority = audit?.authority?.client ?? null;
  const actions: any[] = manifest?.actions ?? [];
  const needsYou = actions.filter((a) => !a.automatable);

  return (
    <div>
      {/* Client context header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Client
          </p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">
            {ov?.name ?? domain}
          </h1>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{domain}</p>
        </div>
        <button
          type="button"
          className="relative rounded-md border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {needsYou.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">
              {needsYou.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex gap-6 overflow-x-auto border-b border-border/60">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'whitespace-nowrap border-b-2 pb-2.5 text-[13px] transition-colors',
              tab === t
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !ov ? (
        <p className="text-sm text-muted-foreground">Client not found.</p>
      ) : (
        <>
          {tab === 'Overview' && <OverviewTab audit={audit} manifest={manifest} authority={authority} actions={actions} runDate={ov.latestRunDate} />}
          {tab === 'Search Visibility' && <SearchVisibilityTab audit={audit} authority={authority} />}
          {tab === 'AI Visibility' && <AIVisibilityTab />}
          {tab === 'Actions' && <ActionsTab actions={actions} />}
          {tab === 'Content' && <ContentTab actions={actions} />}
          {tab === 'Reports' && <ReportsTab />}
          {tab === 'Settings' && <SettingsTab ov={ov} />}
        </>
      )}
    </div>
  );
}

// ── Overview ────────────────────────────────────────────────────────────────

function OverviewTab({ audit, manifest, authority, actions, runDate }: any) {
  const rows = [
    { label: 'Organic visits', today: '—' },
    { label: 'Avg. Google ranking', today: '—' },
    { label: 'Keywords in top 10', today: '—' },
    { label: 'Keywords in top 3', today: '—' },
    { label: 'AI citations', today: '—' },
    { label: 'Domain Authority', today: authority?.score ?? '—' },
    { label: 'Backlinks', today: authority?.backlinks?.toLocaleString?.() ?? '—' },
  ];

  return (
    <div className="space-y-8">
      {/* Progress table */}
      <Section title="Progress" updated={runDate}>
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 text-left font-normal">Metric</th>
                {['Day 0', 'Day 30', 'Day 60', 'Day 90', 'Today'].map((c) => (
                  <th key={c} className="px-4 py-2 text-right font-normal">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="px-4 py-2.5">{r.label}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">—</td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">—</td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">—</td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">—</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.today}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Baseline (Day 0) + history begin tracking from your first run; the
          before/after columns populate over time. Composite Visibility Score,
          organic visits, rankings and AI citations need GSC/GA + tracking wired.
        </p>
      </Section>

      {/* Recent activity */}
      <Section title="Recent activity" updated={runDate}>
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {actions.slice(0, 8).map((a: any) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="min-w-0">
                <span className="font-mono text-xs text-muted-foreground">{a.type}</span>
                <span className="ml-2 truncate text-muted-foreground">{a.target?.url ?? a.provenance?.reason ?? ''}</span>
              </div>
              <StatusPill action={a} />
            </div>
          ))}
          {actions.length === 0 && <Empty>No activity yet — run the pipeline to generate the plan.</Empty>}
        </div>
      </Section>
    </div>
  );
}

// ── Search Visibility ─────────────────────────────────────────────────────────

function SearchVisibilityTab({ audit, authority }: any) {
  const competitors = audit?.authority?.competitors ?? {};
  return (
    <div className="space-y-8">
      <Section title="Authority & trust">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Domain Authority" value={authority?.score ?? '—'} />
          <Stat label="Backlinks" value={authority?.backlinks?.toLocaleString?.() ?? '—'} />
          <Stat label="Referring domains" value={authority?.referringDomains?.toLocaleString?.() ?? '—'} />
        </div>
      </Section>

      <Section title="vs. competitors">
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2 text-left font-normal">Domain</th>
                <th className="px-4 py-2 text-right font-normal">DA</th>
                <th className="px-4 py-2 text-right font-normal">Backlinks</th>
                <th className="px-4 py-2 text-right font-normal">Ref. domains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="bg-primary/5">
                <td className="px-4 py-2.5 font-medium">You</td>
                <td className="px-4 py-2.5 text-right font-mono">{authority?.score ?? '—'}</td>
                <td className="px-4 py-2.5 text-right font-mono">{authority?.backlinks?.toLocaleString?.() ?? '—'}</td>
                <td className="px-4 py-2.5 text-right font-mono">{authority?.referringDomains?.toLocaleString?.() ?? '—'}</td>
              </tr>
              {Object.entries(competitors).map(([name, c]: any) => (
                <tr key={name}>
                  <td className="px-4 py-2.5 text-muted-foreground">{name}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{c.score ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{c.backlinks?.toLocaleString?.() ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{c.referringDomains?.toLocaleString?.() ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <NeedsData
        title="Keywords, traffic & site health"
        detail="Per-keyword rankings + trend, impressions / clicks / CTR (Google Search Console + Analytics), and Core Web Vitals need GSC/GA connected and keyword tracking wired."
      />
    </div>
  );
}

// ── AI Visibility ─────────────────────────────────────────────────────────────

function AIVisibilityTab() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        When someone asks ChatGPT, Perplexity, or Google's AI Overview a question
        in your space, this is whether it names <span className="text-foreground">you</span>.
        Tracked per-platform, never combined — citations now vs. baseline, which
        queries trigger a mention, and which competitor gets cited when you don't.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {['ChatGPT', 'Perplexity', 'Google AI Overview'].map((p) => (
          <div key={p} className="rounded-lg border border-border/60 p-4">
            <p className="text-sm font-medium">{p}</p>
            <p className="mt-2 font-mono text-2xl text-muted-foreground">—</p>
            <p className="mt-1 text-xs text-muted-foreground">citations</p>
          </div>
        ))}
      </div>
      <NeedsData title="AI citation tracking not wired yet" detail="Needs a per-platform citation checker that runs your queries against each engine on a schedule and stores results over time." />
    </div>
  );
}

// ── Actions ───────────────────────────────────────────────────────────────────

function ActionsTab({ actions }: any) {
  const automated = actions.filter((a: any) => a.automatable);
  const needsYou = actions.filter((a: any) => !a.automatable);
  return (
    <div className="space-y-8">
      <div className="flex gap-6 text-sm">
        <span><span className="font-mono text-lg">{automated.length}</span> <span className="text-muted-foreground">automatable</span></span>
        <span><span className="font-mono text-lg">{needsYou.length}</span> <span className="text-muted-foreground">need you</span></span>
        <span><span className="font-mono text-lg">{actions.length}</span> <span className="text-muted-foreground">total</span></span>
      </div>

      <Section title="Waiting on you">
        <ActionList items={needsYou} empty="Nothing needs your sign-off right now." />
      </Section>

      <Section title="Done by rynk (automatable)">
        <ActionList items={automated} empty="No automatable actions." />
      </Section>
    </div>
  );
}

function ActionList({ items, empty }: { items: any[]; empty: string }) {
  if (items.length === 0) return <Empty>{empty}</Empty>;
  return (
    <div className="divide-y divide-border/60 rounded-lg border border-border/60">
      {items.slice(0, 40).map((a) => (
        <div key={a.id} className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{a.type}</span>
              <ChannelChip channel={a.channel} />
              {a.risk && <span className="font-mono text-[10px] text-muted-foreground">risk: {a.risk}</span>}
            </div>
            <p className="mt-1 truncate text-sm">{a.provenance?.reason ?? a.notes ?? ''}</p>
            {a.target?.url && <p className="truncate font-mono text-xs text-muted-foreground">{a.target.url}</p>}
          </div>
          <StatusPill action={a} />
        </div>
      ))}
      {items.length > 40 && <div className="px-4 py-2 text-xs text-muted-foreground">+{items.length - 40} more…</div>}
    </div>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

function ContentTab({ actions }: any) {
  const drafts = actions.filter((a: any) => CONTENT_TYPES.includes(a.type));
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Review rynk's writing before it goes live. Default: <span className="text-foreground">you approve</span> anything
        published or sent (pages, brand posts, outreach); reversible technical
        fixes auto-apply. Everything is logged either way.
      </p>
      {drafts.length === 0 ? (
        <Empty>No drafts to review yet.</Empty>
      ) : (
        <div className="space-y-3">
          {drafts.slice(0, 30).map((a: any) => (
            <div key={a.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{a.type}</span>
                  <ChannelChip channel={a.channel} />
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground">Approve</button>
                  <button className="rounded-md border border-border px-2.5 py-1">Edit</button>
                  <button className="rounded-md border border-border px-2.5 py-1 text-muted-foreground">Reject</button>
                </div>
              </div>
              <p className="mt-2 text-sm">{a.payload?.title ?? a.provenance?.reason ?? a.notes ?? ''}</p>
              {a.target?.url && <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{a.target.url}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────

function ReportsTab() {
  return (
    <NeedsData
      title="Reports"
      detail="Weekly digest, monthly PDF summary, and the gated (3+ month) 'estimated additional visits above baseline' outcome are generated once history + a report generator are wired."
    />
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

function SettingsTab({ ov }: any) {
  const ctx = ov.context ?? {};
  const integrations = [
    { name: 'CMS', status: ctx.cms ? `Detected: ${ctx.cms}` : 'Not connected' },
    { name: 'Google Search Console', status: 'Not connected' },
    { name: 'Google Analytics', status: 'Not connected' },
  ];
  return (
    <div className="space-y-8">
      <Section title="Client info">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Field label="Domain" value={ov.domain} />
          <Field label="Legal entity" value={ctx.legalEntity ?? '—'} />
          <Field label="Industry" value={ctx.industry ?? '—'} />
          <Field label="Status" value={ov.status} />
        </dl>
      </Section>
      <Section title="Integrations">
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span>{i.name}</span>
              <span className="text-muted-foreground">{i.status}</span>
            </div>
          ))}
        </div>
      </Section>
      <NeedsData title="Team, roles & billing" detail="Team members + roles and plan/billing come with the accounts + billing layer." />
    </div>
  );
}

// ── Shared bits ───────────────────────────────────────────────────────────────

function Section({ title, updated, children }: { title: string; updated?: string | null; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-medium">{title}</h2>
        {updated && <span className="font-mono text-[10px] text-muted-foreground">updated {updated}</span>}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 px-4 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}

function StatusPill({ action }: { action: any }) {
  const label = action.automatable ? 'auto' : 'needs you';
  const cls = action.automatable
    ? 'bg-primary/10 text-primary'
    : 'bg-[hsl(var(--status-pending))]/15 text-[hsl(var(--status-pending))]';
  return <span className={cn('shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]', cls)}>{label}</span>;
}

function ChannelChip({ channel }: { channel?: string }) {
  if (!channel) return null;
  return <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{channel}</span>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-8 text-center text-sm text-muted-foreground">{children}</div>;
}

function NeedsData({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/10 p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Not tracked yet</p>
      <h3 className="mt-2 text-base font-medium">{title}</h3>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
