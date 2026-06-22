/**
 * Client overview.
 *
 * Layout: bento grid — big "headline" card on the left (DA + client info),
 * smaller stat cards on the right, channel breakdown spans bottom row.
 * Asymmetric, data-forward, distinct from the standard 4-equal-card pattern.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { CHANNEL_META, CHANNEL_ORDER } from "@/lib/channels";
import { formatCount, formatDate } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

/** Static channel-to-class map. Tailwind needs literal class names. */
const CHANNEL_BG: Record<string, string> = {
  cms: "bg-channel-cms",
  image: "bg-channel-image",
  outreach: "bg-channel-outreach",
  social: "bg-channel-social",
  "code-pr": "bg-channel-code-pr",
  document: "bg-channel-document",
  offsite: "bg-channel-offsite",
};

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<React.JSX.Element> {
  const { domain } = await params;
  const store = getDataStore();
  const overview = await store.getClientOverview(domain);

  if (!overview) return notFound();

  const { context, latestAudit, latestStrategy, latestManifest, latestRunDate } = overview;
  const totalIssues =
    (latestAudit?.prioritizedIssues.p1.length ?? 0) +
    (latestAudit?.prioritizedIssues.p2.length ?? 0) +
    (latestAudit?.prioritizedIssues.p3.length ?? 0);

  return (
    <div className="space-y-8">
      {/* Breadcrumb + title */}
      <div>
        <Link href="/app" className="font-mono text-[11px] text-muted-foreground hover:text-foreground">
          ← clients
        </Link>
        <div className="mt-3 flex items-baseline gap-3">
          <h1 className="text-3xl font-medium tracking-tight">
            {context.legalEntity || context.domain}
          </h1>
          <span className="font-mono text-xs text-muted-foreground">{context.domain}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {context.industry && <span>{context.industry}</span>}
          {latestRunDate && (
            <>
              <span>·</span>
              <span className="font-mono">last run {formatDate(latestRunDate)}</span>
            </>
          )}
        </div>
      </div>

      {/* BENTO GRID — asymmetric */}
      <div className="grid gap-3 lg:grid-cols-4 lg:grid-rows-2">
        {/* Big DA card — top-left, spans 2 cols x 1 row */}
        <div className="lg:col-span-2 lg:row-span-1 rounded-lg border border-border/60 bg-card p-6">
          <div className="flex items-start justify-between">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Domain Authority
            </p>
            {latestAudit?.authority.client.provider && (
              <span className="font-mono text-[10px] text-muted-foreground">
                via {latestAudit.authority.client.provider}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-6xl font-medium tracking-tight">
              {latestAudit?.authority.client.score ?? "—"}
            </span>
            <span className="font-mono text-sm text-muted-foreground">/ 100</span>
          </div>
          {latestAudit?.authority.client.backlinks !== null &&
            latestAudit?.authority.client.backlinks !== undefined && (
              <div className="mt-6 flex gap-8 text-sm">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Backlinks
                  </div>
                  <div className="mt-1 font-mono">
                    {formatCount(latestAudit.authority.client.backlinks)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Referring domains
                  </div>
                  <div className="mt-1 font-mono">
                    {formatCount(latestAudit.authority.client.referringDomains ?? 0)}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Three stat tiles on the right */}
        <StatTile
          label="P1 issues"
          value={latestAudit?.prioritizedIssues.p1.length ?? 0}
          hint="critical"
        />
        <StatTile
          label="Content briefs"
          value={latestStrategy?.contentBriefs.length ?? 0}
          hint="from strategy"
        />
        <StatTile
          label="Actions planned"
          value={latestManifest?.summary.totalActions ?? 0}
          hint={`${latestManifest?.summary.automatable ?? 0} automatable`}
          wide
        />
        <StatTile
          label="Total issues"
          value={totalIssues}
          hint="P1 + P2 + P3"
        />
      </div>

      {/* Channel breakdown — horizontal bar */}
      {latestManifest && (
        <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Execution channels
              </p>
              <h2 className="mt-0.5 text-base font-medium">Planned actions by output channel</h2>
            </div>
            <Link
              href={`/app/execution?domain=${context.domain}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View manifest
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {/* Channel rows */}
          <div className="divide-y divide-border/60">
            {CHANNEL_ORDER.map((channel) => {
              const count = latestManifest.summary.byChannel[channel] ?? 0;
              if (count === 0) return null;
              const meta = CHANNEL_META[channel];
              const pct = Math.round((count / latestManifest.summary.totalActions) * 100);
              return (
                <div key={channel} className="grid grid-cols-[120px_1fr_60px_60px] items-center gap-4 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_BG[channel]}`} />
                    <span className="text-sm font-medium">{meta.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${CHANNEL_BG[channel]}`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                  <div className="text-right font-mono text-sm">{formatCount(count)}</div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section deep-links */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SectionLink
          label="Audit"
          title="Findings & issues"
          value={`${totalIssues} issues`}
          href={`/app/audit?domain=${context.domain}`}
        />
        <SectionLink
          label="Strategy"
          title="Clusters & briefs"
          value={`${latestStrategy?.topicClusterMap.length ?? 0} clusters · ${latestStrategy?.contentBriefs.length ?? 0} briefs`}
          href={`/app/strategy?domain=${context.domain}`}
        />
        <SectionLink
          label="Execution"
          title="Action queue"
          value={`${latestManifest?.summary.totalActions ?? 0} actions`}
          href={`/app/execution?domain=${context.domain}`}
        />
      </div>
    </div>
  );
}

// ── Presentational pieces ────────────────────────────────────────────────

function StatTile({
  label,
  value,
  hint,
  wide,
}: {
  label: string;
  value: number;
  hint: string;
  wide?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={`rounded-lg border border-border/60 bg-card p-5 ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 font-mono text-3xl font-medium tracking-tight">
        {formatCount(value)}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function SectionLink({
  label,
  title,
  value,
  href,
}: {
  label: string;
  title: string;
  value: string;
  href: string;
}): React.JSX.Element {
  return (
    <Link href={href} className="group rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
      <div className="mt-3 text-base font-medium">{title}</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{value}</div>
    </Link>
  );
}
