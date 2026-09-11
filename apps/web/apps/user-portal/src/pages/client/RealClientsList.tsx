/**
 * Clients list (authed app home) — real data from the backend.
 *
 * One navy card per onboarded client, enriched with its latest run summary
 * (DA / action count / run date). "+ Add a site" and the empty state both lead
 * into the real onboard-and-run flow (/onboard).
 */
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Plus, ArrowRight } from 'lucide-react';
import { useGetClients } from '@shared/hooks/rq/queries/useGetClients';
import { Panel } from './ui';

export function RealClientsList() {
  const navigate = useNavigate();
  const { data: clients, isLoading, isError } = useGetClients();

  return (
    <div className="text-brand-text">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft">Clients</p>
          <h1 className="mt-1.5 font-serif text-3xl font-medium tracking-tight">
            {clients ? `${clients.length} ${clients.length === 1 ? 'site' : 'sites'}` : 'Your sites'}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/onboard')}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 font-serif text-sm font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)]"
        >
          <Plus className="h-4 w-4" /> Add a site
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-16 text-brand-textMute">
          <Loader2 className="h-4 w-4 animate-spin" /> <span className="font-mono text-sm">Loading your sites…</span>
        </div>
      ) : isError ? (
        <p className="py-16 font-mono text-sm text-brand-textMute">Couldn't load clients. Is the backend running?</p>
      ) : !clients || clients.length === 0 ? (
        <EmptyState onAdd={() => navigate('/onboard')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clients.map((c) => (
            <Link key={c.id} to={`/clients/${c.domain}`} className="group block">
              <Panel accent="via-brand-blue" className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-white/15">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-medium tracking-tight text-brand-text">
                      {c.legalEntity ?? c.domain}
                    </h3>
                    <p className="mt-0.5 truncate font-mono text-xs text-brand-textMute">
                      {c.domain}
                      {c.industry ? ` · ${c.industry}` : ''}
                    </p>
                  </div>
                  {c.latestDAScore != null && (
                    <div className="shrink-0 text-right">
                      <div className="font-serif text-3xl leading-none tracking-tight text-brand-text">{c.latestDAScore}</div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-textMute">DA</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[11px]">
                  <span className="font-mono text-brand-textMute">
                    {c.latestActionCount != null ? `${c.latestActionCount} actions` : 'not run yet'}
                  </span>
                  <span className="font-mono text-brand-textMute">
                    {c.latestRunDate ? `run ${c.latestRunDate}` : 'awaiting first run'}
                  </span>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-white/[0.02] p-10 text-center ring-1 ring-white/8">
      <h2 className="font-serif text-2xl font-medium tracking-tight">Add your first site</h2>
      <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-brand-textMute">
        Enter a website URL and rynk crawls it live, audits every page, builds a strategy, and generates the plan — automatically.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 font-serif text-[15px] font-medium text-brand-ink transition-all hover:shadow-[0_12px_30px_-12px_rgba(255,255,255,0.4)]"
      >
        Add a site <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
