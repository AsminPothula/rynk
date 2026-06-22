/**
 * /app/offsite — outreach + brand-post queue
 *
 * Renders draft_outreach and draft_brand_post actions in an
 * inbox/queue-style UI. Tab-based view: Outreach vs Brand Posts.
 * Each item shows the recipient/platform, subject/body preview,
 * suggested date, and copy-to-clipboard button.
 *
 * Server-rendered; tab state in URL search params.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { cn, formatCount } from "@/lib/utils";
import type {
  DraftBrandPostAction,
  DraftOutreachAction,
  ExecutionAction,
} from "@rynk/layer3-generate";

export const dynamic = "force-dynamic";

type View = "outreach" | "social";

interface PageProps {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ view?: View }>;
}

export default async function OffsitePage({ params, searchParams }: PageProps): Promise<React.JSX.Element> {
  const { domain } = await params;
  const { view } = await searchParams;

  const store = getDataStore();
  const overview = await store.getClientOverview(domain);
  if (!overview || !overview.latestManifest) return notFound();

  const outreach = overview.latestManifest.actions.filter(isOutreach);
  const social = overview.latestManifest.actions.filter(isBrandPost);

  const activeView: View = view ?? "outreach";

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Offsite
        </p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">
          {formatCount(outreach.length + social.length)} drafts in queue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ready for the team to review, personalize, and send.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 -mt-2">
        <Tab
          domain={domain}
          view="outreach"
          label="Outreach"
          count={outreach.length}
          isActive={activeView === "outreach"}
          dotClass="bg-channel-outreach"
        />
        <Tab
          domain={domain}
          view="social"
          label="Brand posts"
          count={social.length}
          isActive={activeView === "social"}
          dotClass="bg-channel-social"
        />
      </div>

      {/* Items */}
      <div className="space-y-3">
        {activeView === "outreach" &&
          (outreach.length === 0 ? <Empty label="No outreach drafts" /> : outreach.map((a) => <OutreachItem key={a.id} action={a} />))}
        {activeView === "social" &&
          (social.length === 0 ? <Empty label="No brand-post drafts" /> : social.map((a) => <BrandPostItem key={a.id} action={a} />))}
      </div>
    </div>
  );
}

// ── Type guards ──────────────────────────────────────────────────────────

function isOutreach(a: ExecutionAction): a is DraftOutreachAction {
  return a.type === "draft_outreach";
}

function isBrandPost(a: ExecutionAction): a is DraftBrandPostAction {
  return a.type === "draft_brand_post";
}

// ── Tab pill ─────────────────────────────────────────────────────────────

function Tab({
  domain,
  view,
  label,
  count,
  isActive,
  dotClass,
}: {
  domain: string;
  view: View;
  label: string;
  count: number;
  isActive: boolean;
  dotClass: string;
}): React.JSX.Element {
  const href =
    view === "outreach"
      ? `/app/clients/${domain}/offsite`
      : `/app/clients/${domain}/offsite?view=${view}`;
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
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
      {label}
      <span
        className={cn(
          "font-mono text-xs",
          isActive ? "opacity-80" : "text-muted-foreground/70",
        )}
      >
        {formatCount(count)}
      </span>
    </Link>
  );
}

// ── Outreach item ────────────────────────────────────────────────────────

function OutreachItem({ action }: { action: DraftOutreachAction }): React.JSX.Element {
  const recipient =
    action.target.recipientName ?? action.target.recipientDomain;
  return (
    <details className="group rounded-lg border border-border/60 overflow-hidden">
      <summary className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <OutreachTypeChip type={action.target.outreachType} />
            <span className="font-mono text-[11px] text-muted-foreground truncate">
              → {recipient}
            </span>
          </div>
          <div className="font-medium text-sm truncate">{action.payload.subject}</div>
        </div>
        <div className="flex items-center gap-3 justify-self-end whitespace-nowrap">
          {action.payload.suggestedSendDate && (
            <span className="font-mono text-xs text-muted-foreground">
              {action.payload.suggestedSendDate}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted-foreground">{action.id}</span>
        </div>
      </summary>
      <div className="border-t border-border/60 bg-muted/20 px-5 py-4 space-y-3">
        <Field label="Subject" value={action.payload.subject} />
        <Field label="Body" value={action.payload.body} mono />
        <Field label="Reason" value={action.provenance.reason} />
        {action.notes && <Field label="Notes" value={action.notes} />}
      </div>
    </details>
  );
}

function OutreachTypeChip({ type }: { type: DraftOutreachAction["target"]["outreachType"] }): React.JSX.Element {
  const LABEL: Record<typeof type, string> = {
    "backlink-request": "Backlink",
    "guest-post-pitch": "Guest pitch",
    "haro-response": "HARO",
    "podcast-pitch": "Podcast",
    "press-pitch": "Press",
    "partnership": "Partnership",
  };
  return (
    <span className="rounded-full bg-channel-outreach/15 text-channel-outreach px-2 py-0.5 text-[10px] font-medium">
      {LABEL[type]}
    </span>
  );
}

// ── Brand-post item ─────────────────────────────────────────────────────

function BrandPostItem({ action }: { action: DraftBrandPostAction }): React.JSX.Element {
  const platform = action.target.subPlatform
    ? `${action.target.platform} / ${action.target.subPlatform}`
    : action.target.platform;
  const previewBody = action.payload.body.slice(0, 140);

  return (
    <details className="group rounded-lg border border-border/60 overflow-hidden">
      <summary className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PlatformChip platform={action.target.platform} />
            <span className="font-mono text-[11px] text-muted-foreground truncate">
              {platform}
            </span>
          </div>
          <div className="text-sm truncate">{previewBody}…</div>
        </div>
        <div className="flex items-center gap-3 justify-self-end whitespace-nowrap">
          {action.payload.suggestedPublishDate && (
            <span className="font-mono text-xs text-muted-foreground">
              {action.payload.suggestedPublishDate}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted-foreground">{action.id}</span>
        </div>
      </summary>
      <div className="border-t border-border/60 bg-muted/20 px-5 py-4 space-y-3">
        <Field label="Body" value={action.payload.body} mono />
        <Field label="Rationale" value={action.payload.rationale} />
        {action.notes && <Field label="Notes" value={action.notes} />}
      </div>
    </details>
  );
}

function PlatformChip({ platform }: { platform: DraftBrandPostAction["target"]["platform"] }): React.JSX.Element {
  const LABEL: Record<typeof platform, string> = {
    linkedin: "LinkedIn",
    twitter: "Twitter",
    reddit: "Reddit",
    threads: "Threads",
    blog: "Blog",
  };
  return (
    <span className="rounded-full bg-channel-social/15 text-channel-social px-2 py-0.5 text-[10px] font-medium">
      {LABEL[platform]}
    </span>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className={cn("text-sm leading-relaxed whitespace-pre-wrap", mono && "font-mono text-xs")}>
        {value}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
