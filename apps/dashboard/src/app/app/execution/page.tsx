/**
 * Execution manifest viewer — /app/execution
 *
 * Renders every action rynk has planned for the selected client, grouped
 * by channel, with channel filter tabs in the URL search params (so the
 * page stays server-rendered and shareable).
 *
 * Search params:
 *   - domain (required) — which client's manifest to render
 *   - channel (optional) — filter to a specific channel, e.g. "cms"
 *   - type (optional)    — filter to a specific action type, e.g. "update_meta"
 */

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { CHANNEL_META, CHANNEL_ORDER } from "@/lib/channels";
import { formatCount, cn } from "@/lib/utils";
import { ActionRow } from "./action-row";
import type { ActionChannel, ExecutionAction } from "@rynk/layer3-generate";

export const dynamic = "force-dynamic";

/** Static channel-to-class lookup. Tailwind needs literal class names. */
const CHANNEL_DOT_BG: Record<string, string> = {
  cms: "bg-channel-cms",
  image: "bg-channel-image",
  outreach: "bg-channel-outreach",
  social: "bg-channel-social",
  "code-pr": "bg-channel-code-pr",
  document: "bg-channel-document",
  offsite: "bg-channel-offsite",
};

interface PageProps {
  searchParams: Promise<{ domain?: string; channel?: string }>;
}

export default async function ExecutionPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const { domain, channel } = await searchParams;

  if (!domain) redirect("/app");

  const store = getDataStore();
  const overview = await store.getClientOverview(domain);
  if (!overview || !overview.latestManifest) return notFound();

  const manifest = overview.latestManifest;
  const summary = manifest.summary;

  // Filter actions by channel if requested.
  const filterChannel = (channel ?? "all") as ActionChannel | "all";
  const visibleActions =
    filterChannel === "all"
      ? manifest.actions
      : manifest.actions.filter((a) => a.channel === filterChannel);

  return (
    <div className="space-y-8">
      {/* Breadcrumb + title */}
      <div>
        <Link
          href={`/app/clients/${domain}`}
          className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
        >
          ← {domain}
        </Link>
        <div className="mt-3 flex items-baseline gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Execution</h1>
          <span className="font-mono text-xs text-muted-foreground">manifest</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatCount(summary.totalActions)} planned actions ·{" "}
          <span className="text-foreground">{formatCount(summary.automatable)} automatable</span> ·{" "}
          {formatCount(summary.requiresHumanApproval)} need approval
        </p>
      </div>

      {/* Channel filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5 -mt-2">
        <ChannelTab
          domain={domain}
          channel="all"
          label="All"
          count={summary.totalActions}
          isActive={filterChannel === "all"}
        />
        {CHANNEL_ORDER.map((ch) => {
          const count = summary.byChannel[ch] ?? 0;
          if (count === 0) return null;
          return (
            <ChannelTab
              key={ch}
              domain={domain}
              channel={ch}
              label={CHANNEL_META[ch].label}
              count={count}
              isActive={filterChannel === ch}
              dotClass={CHANNEL_DOT_BG[ch]}
            />
          );
        })}
      </div>

      {/* Actions list — grouped by type for visual rhythm */}
      <div className="space-y-2">
        {groupByType(visibleActions).map(([type, actions]) => (
          <TypeGroup key={type} type={type} actions={actions} />
        ))}
        {visibleActions.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No actions in this channel.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Channel filter pill ─────────────────────────────────────────────────

function ChannelTab({
  domain,
  channel,
  label,
  count,
  isActive,
  dotClass,
}: {
  domain: string;
  channel: ActionChannel | "all";
  label: string;
  count: number;
  isActive: boolean;
  dotClass?: string;
}): React.JSX.Element {
  const href =
    channel === "all"
      ? `/app/execution?domain=${domain}`
      : `/app/execution?domain=${domain}&channel=${channel}`;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {dotClass && <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />}
      {label}
      <span className={cn("font-mono text-xs", isActive ? "opacity-80" : "text-muted-foreground/70")}>
        {formatCount(count)}
      </span>
    </Link>
  );
}

// ── Type-grouped block ──────────────────────────────────────────────────

function TypeGroup({
  type,
  actions,
}: {
  type: string;
  actions: ExecutionAction[];
}): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-b border-border/60">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {type.replace(/_/g, " ")}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{formatCount(actions.length)}</span>
      </div>
      <div className="divide-y divide-border/60">
        {actions.map((action) => (
          <ActionRow key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

function groupByType(actions: ExecutionAction[]): Array<[string, ExecutionAction[]]> {
  const groups = new Map<string, ExecutionAction[]>();
  for (const a of actions) {
    const list = groups.get(a.type) ?? [];
    list.push(a);
    groups.set(a.type, list);
  }
  return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
}
