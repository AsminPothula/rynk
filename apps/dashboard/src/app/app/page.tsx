/**
 * App home — clients list.
 *
 * Layout choice: dense table-style row list instead of 3-column card grid.
 * Each row shows everything at a glance: domain, name, industry, DA,
 * action count, latest run. Hover reveals an arrow. Mono numbers, tight
 * borders, Linear/Vercel-style density.
 */

import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { formatCount, formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppHomePage(): Promise<React.JSX.Element> {
  const store = getDataStore();
  const clients = await store.listClients();

  return (
    <div>
      {/* Header row — title + count + add button slot */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Clients
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">
            {clients.length === 0 ? "No clients yet" : `${clients.length} active`}
          </h1>
        </div>
        <button
          type="button"
          className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          + Add client
        </button>
      </div>

      {clients.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-lg border border-border/60 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_80px_100px_120px_40px] items-center gap-4 border-b border-border/60 bg-muted/30 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Client</span>
            <span>Industry</span>
            <span className="text-right">DA</span>
            <span className="text-right">Actions</span>
            <span className="text-right">Latest run</span>
            <span></span>
          </div>

          <div className="divide-y divide-border/60">
            {clients.map((client) => (
              <Link
                key={client.domain}
                href={`/app/clients/${client.domain}`}
                className="group block px-5 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="grid md:grid-cols-[1.5fr_1fr_80px_100px_120px_40px] items-center gap-4">
                  <div>
                    <div className="font-medium">
                      {client.legalEntity ?? client.domain}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {client.domain}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {client.industry ?? "—"}
                  </div>
                  <div className="text-right font-mono text-sm">
                    {client.latestDAScore !== null ? client.latestDAScore : "—"}
                  </div>
                  <div className="text-right font-mono text-sm">
                    {client.latestActionCount !== null
                      ? formatCount(client.latestActionCount)
                      : "—"}
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

function EmptyState(): React.JSX.Element {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
        Empty
      </p>
      <h3 className="mt-3 text-lg font-medium">No clients onboarded yet</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">npm run pipeline -- example.com</code> from the project root to onboard your first client.
      </p>
    </div>
  );
}
