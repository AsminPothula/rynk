/**
 * Clients list — the dashboard home. Navy cards, one per client, linking into
 * each client's dashboard. Sample-data driven for now (swaps to the real
 * clients query when the DB lands). `basePath` lets the same component serve the
 * authed app (/clients) and the auth-free preview (/preview).
 */
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SAMPLE_LIST, type ClientData } from './sampleData';
import { Panel, Delta } from './ui';

export function ClientsList({ basePath = '/clients' }: { basePath?: string }) {
  const clients = SAMPLE_LIST;
  return (
    <div className="text-brand-text">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">Clients</p>
          <h1 className="mt-1.5 font-serif text-3xl font-medium tracking-tight">{clients.length} active</h1>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 font-serif text-sm font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)]"
        >
          + Onboard a client
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map((c) => (
          <ClientCard key={c.domain} c={c} basePath={basePath} />
        ))}
      </div>
    </div>
  );
}

function ClientCard({ c, basePath }: { c: ClientData; basePath: string }) {
  const scoreDelta = c.visibilityScore.today - c.visibilityScore.baseline;
  const waiting = c.waitingOnYou.length;
  return (
    <Link to={`${basePath}/${c.domain}`} className="group block">
      <Panel accent="via-brand-blue" className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-white/15">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">{c.plan}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">
                {c.kind === 'local' ? 'Local' : 'Content'}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-xl font-medium tracking-tight text-brand-text">{c.name}</h3>
            <p className="mt-0.5 truncate font-mono text-xs text-brand-textMute">
              {c.domain}
              {c.location ? ` · ${c.location}` : ''}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-serif text-3xl leading-none tracking-tight text-brand-text">{c.visibilityScore.today}</div>
            <div className="mt-1">
              <Delta value={scoreDelta} goodDirection="up" />
            </div>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-textMute">score</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[11px]">
          <span className={cn('font-mono', waiting > 0 ? 'text-brand-highlight' : 'text-brand-textMute')}>
            {waiting > 0 ? `${waiting} waiting on you` : 'nothing pending'}
          </span>
          <span className="font-mono text-brand-textMute">updated {c.lastUpdated}</span>
        </div>
      </Panel>
    </Link>
  );
}
