/**
 * Client overview — first drill-in screen.
 *
 * Today: high-level summary of the client + their latest audit, strategy,
 * and execution manifest. Linked tabs (audit / strategy / execution)
 * become real pages in subsequent commits.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { CHANNEL_META, CHANNEL_ORDER } from "@/lib/channels";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCount, formatDate } from "@/lib/utils";
import type { ActionChannel } from "@rynk/layer3-generate";

export const dynamic = "force-dynamic";

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/app" className="text-xs text-muted-foreground hover:text-foreground">
          ← Clients
        </Link>
        <div className="mt-2 flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {context.legalEntity || context.domain}
          </h1>
          <span className="font-mono text-xs text-muted-foreground">{context.domain}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {context.industry}
          {latestRunDate && ` · Latest run: ${formatDate(latestRunDate)}`}
        </p>
      </div>

      {/* High-level metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Domain Authority"
          value={latestAudit?.authority.client.score?.toString() ?? "—"}
          hint={
            latestAudit?.authority.client.provider
              ? `via ${latestAudit.authority.client.provider}`
              : undefined
          }
        />
        <MetricCard
          label="P1 Issues"
          value={(latestAudit?.prioritizedIssues.p1.length ?? 0).toString()}
          hint="critical"
        />
        <MetricCard
          label="Content Briefs"
          value={(latestStrategy?.contentBriefs.length ?? 0).toString()}
          hint="from strategy"
        />
        <MetricCard
          label="Total Actions"
          value={formatCount(latestManifest?.summary.totalActions ?? 0)}
          hint={`${latestManifest?.summary.automatable ?? 0} automatable`}
        />
      </div>

      {/* Manifest channel breakdown */}
      {latestManifest && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Execution by channel</CardTitle>
            <CardDescription>What rynk plans to do, grouped by where it lives.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHANNEL_ORDER.map((channel) => {
                const count = latestManifest.summary.byChannel[channel] ?? 0;
                if (count === 0) return null;
                const meta = CHANNEL_META[channel];
                return (
                  <div key={channel} className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <Badge variant={meta.badgeVariant as ChannelBadge}>{meta.label}</Badge>
                    <div className="font-mono text-sm">{formatCount(count)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick links into deeper views */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SectionLink
          title="Audit findings"
          description={`${(latestAudit?.prioritizedIssues.p1.length ?? 0) + (latestAudit?.prioritizedIssues.p2.length ?? 0) + (latestAudit?.prioritizedIssues.p3.length ?? 0)} issues across P1/P2/P3.`}
          href={`/app/audit?domain=${context.domain}`}
        />
        <SectionLink
          title="Strategy"
          description={`${latestStrategy?.topicClusterMap.length ?? 0} clusters, ${latestStrategy?.contentBriefs.length ?? 0} briefs.`}
          href={`/app/strategy?domain=${context.domain}`}
        />
        <SectionLink
          title="Execution"
          description={`${latestManifest?.summary.totalActions ?? 0} planned actions.`}
          href={`/app/execution?domain=${context.domain}`}
        />
      </div>
    </div>
  );
}

// ── Local presentational pieces ──────────────────────────────────────────

/** Narrowed type for the channel-specific badge variants. */
type ChannelBadge =
  | "channel-cms"
  | "channel-image"
  | "channel-outreach"
  | "channel-social"
  | "channel-code-pr"
  | "channel-document"
  | "channel-offsite";

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 font-mono text-2xl font-semibold">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function SectionLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}): React.JSX.Element {
  return (
    <Link href={href} className="group">
      <Card className="transition-colors hover:border-foreground/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-medium">{title}</div>
            <span className="text-muted-foreground transition-transform group-hover:translate-x-1">→</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
