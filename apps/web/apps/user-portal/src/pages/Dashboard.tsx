/**
 * Clients list — rynk client dashboard home.
 *
 * Ported from apps/dashboard (Next.js) into the SPA: identical dense-table
 * design, but data now comes from the NestJS backend via useGetClients()
 * instead of reading runs/ files server-side.
 */
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetClients, type ClientSummaryVm } from '@shared/hooks/rq/queries/useGetClients';

function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function Dashboard() {
  const { data: clients = [], isLoading } = useGetClients();

  return (
    <div>
      {/* Header row — title + count + add button */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Clients
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">
            {isLoading
              ? 'Loading…'
              : clients.length === 0
                ? 'No clients yet'
                : `${clients.length} active`}
          </h1>
        </div>
        <button
          type="button"
          className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted/50 sm:inline-flex"
        >
          + Add client
        </button>
      </div>

      {!isLoading && clients.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60">
          {/* Table header */}
          <div className="hidden grid-cols-[1.5fr_1fr_80px_100px_120px_40px] items-center gap-4 border-b border-border/60 bg-muted/30 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:grid">
            <span>Client</span>
            <span>Industry</span>
            <span className="text-right">DA</span>
            <span className="text-right">Actions</span>
            <span className="text-right">Latest run</span>
            <span></span>
          </div>

          <div className="divide-y divide-border/60">
            {clients.map((client: ClientSummaryVm) => (
              <Link
                key={client.domain}
                to={`/clients/${client.domain}`}
                className="group block px-5 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="grid items-center gap-4 md:grid-cols-[1.5fr_1fr_80px_100px_120px_40px]">
                  <div>
                    <div className="font-medium">
                      {client.legalEntity ?? client.domain}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {client.domain}
                    </div>
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {client.industry ?? '—'}
                  </div>
                  <div className="text-right font-mono text-sm">
                    {client.latestDAScore !== null ? client.latestDAScore : '—'}
                  </div>
                  <div className="text-right font-mono text-sm">
                    {client.latestActionCount !== null
                      ? formatCount(client.latestActionCount)
                      : '—'}
                  </div>
                  <div className="text-right font-mono text-xs text-muted-foreground">
                    {formatDate(client.latestRunDate)}
                  </div>
                  <div className="text-right text-muted-foreground transition-transform group-hover:translate-x-1">
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Empty
      </p>
      <h3 className="mt-3 text-lg font-medium">No clients onboarded yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Onboard your first client to get started.
      </p>
    </div>
  );
}
