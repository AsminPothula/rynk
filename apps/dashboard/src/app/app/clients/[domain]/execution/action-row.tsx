/**
 * ActionRow — single action in the execution manifest viewer.
 *
 * Shows ID, type-specific "target" summary, key payload preview, status
 * badge, channel chip. Uses <details> for native expand/collapse so we
 * stay server-rendered (no client component required).
 *
 * Exhaustive switch over action.type — adding a new action type in
 * @rynk/layer3-generate forces a compile error here too. Single source
 * of truth, no silent skipping.
 */

import type { ExecutionAction } from "@rynk/layer3-generate";
import { cn } from "@/lib/utils";
import { ActionRationale } from "@/components/app/action-rationale";

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-status-skipped/15 text-status-skipped",
  staged: "bg-status-pending/15 text-status-pending",
  approved: "bg-status-pending/15 text-status-pending",
  applied: "bg-status-success/15 text-status-success",
  failed: "bg-status-failed/15 text-status-failed",
  skipped: "bg-status-skipped/15 text-status-skipped",
  rejected: "bg-status-failed/15 text-status-failed",
};

const RISK_CLASS: Record<string, string> = {
  low: "text-status-success",
  medium: "text-status-pending",
  high: "text-status-failed",
};

const CHANNEL_DOT: Record<string, string> = {
  cms: "bg-channel-cms",
  image: "bg-channel-image",
  outreach: "bg-channel-outreach",
  social: "bg-channel-social",
  "code-pr": "bg-channel-code-pr",
  document: "bg-channel-document",
  offsite: "bg-channel-offsite",
};

export function ActionRow({ action }: { action: ExecutionAction }): React.JSX.Element {
  const target = describeTarget(action);
  return (
    <details className="group">
      <summary className="grid grid-cols-[80px_1fr_auto] items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
        <span className="font-mono text-xs text-muted-foreground truncate">{action.id}</span>
        <span className="text-sm truncate">
          <span className={cn("inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle", CHANNEL_DOT[action.channel])} />
          {target}
        </span>
        <span className="flex items-center gap-2 justify-self-end">
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-mono", STATUS_CLASS[action.status])}>
            {action.status}
          </span>
          <span className={cn("font-mono text-[10px] uppercase", RISK_CLASS[action.risk])}>{action.risk}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {action.automatable ? "auto" : "human"}
          </span>
        </span>
      </summary>

      {/* Expanded detail panel */}
      <div className="border-t border-border/60 bg-muted/20 px-4 py-4 space-y-3">
        <ActionRationale action={action} compact />
        <div className="space-y-3 font-mono text-xs">
          <KV label="Source" value={`${action.provenance.source} · ${action.provenance.sourceId}`} />
          <KV label="Reason" value={action.provenance.reason} />
          {action.notes && <KV label="Notes" value={action.notes} />}
          <PayloadPreview action={action} />
        </div>
      </div>
    </details>
  );
}

// ── Description per action type ─────────────────────────────────────────

function describeTarget(action: ExecutionAction): string {
  switch (action.type) {
    case "create_page":
      return `${action.target.pageType}: ${action.target.slug}`;
    case "update_page":
      return `${action.target.operation}: ${action.target.url}`;
    case "update_meta":
      return action.target.url;
    case "add_redirect":
      return `${action.target.sourceUrl} → ${action.target.targetUrl}`;
    case "inject_schema":
      return `${action.target.schemaType} @ ${action.target.url}`;
    case "insert_internal_link":
      return `${action.target.sourceUrl} → ${action.target.targetUrl}`;
    case "create_author":
      return `@${action.target.username}`;
    case "assign_author":
      return `@${action.target.authorUsername} → ${action.target.postUrl}`;
    case "add_nap_block":
      return action.target.url;
    case "create_image":
      return `${action.target.purpose} for ${action.target.contextSlug}`;
    case "create_document":
      return `${action.target.format.toUpperCase()} · ${action.target.docType}`;
    case "draft_brand_post":
      return action.target.subPlatform
        ? `${action.target.platform}/${action.target.subPlatform}`
        : action.target.platform;
    case "draft_outreach":
      return `${action.target.outreachType} → ${action.target.recipientDomain}`;
    case "propose_code_change":
      return `${action.target.repo} · ${action.target.branch}`;
    case "update_offsite_profile":
      return action.target.platform;
    default: {
      const _exhaustive: never = action;
      return JSON.stringify(_exhaustive);
    }
  }
}

// ── Payload preview per action type ─────────────────────────────────────

function PayloadPreview({ action }: { action: ExecutionAction }): React.JSX.Element {
  switch (action.type) {
    case "update_meta":
      return (
        <>
          <KV label="Title" value={action.payload.title} />
          <KV label="Meta" value={action.payload.metaDescription} />
        </>
      );
    case "create_page":
      return (
        <>
          <KV label="Title" value={action.payload.title} />
          <KV label="Meta" value={action.payload.metaDescription} />
          <KV label="Body" value={`${action.payload.bodyMarkdown.length} chars`} />
          {action.payload.imageActionIds.length > 0 && (
            <KV label="Images" value={action.payload.imageActionIds.join(", ")} />
          )}
        </>
      );
    case "inject_schema":
      return <KV label="JSON-LD" value={truncate(JSON.stringify(action.payload.jsonLd), 280)} />;
    case "add_redirect":
      return <KV label="Status code" value={String(action.payload.statusCode)} />;
    case "insert_internal_link":
      return <KV label="Anchor" value={action.payload.anchorText} />;
    case "create_image":
      return (
        <>
          <KV label="Dimensions" value={`${action.payload.width} × ${action.payload.height}`} />
          <KV label="Alt" value={action.payload.altText} />
          <KV label="Prompt" value={truncate(action.payload.prompt, 220)} />
          {action.payload.resultUrl && <KV label="URL" value={action.payload.resultUrl} />}
        </>
      );
    case "create_document":
      return (
        <>
          <KV label="Title" value={action.payload.title} />
          <KV label="Body" value={`${action.payload.bodyMarkdown.length} chars`} />
          {action.payload.distributionPlatforms.length > 0 && (
            <KV label="Distribute" value={action.payload.distributionPlatforms.join(", ")} />
          )}
        </>
      );
    case "draft_outreach":
      return (
        <>
          <KV label="Subject" value={action.payload.subject} />
          <KV label="Body" value={truncate(action.payload.body, 280)} />
          {action.payload.suggestedSendDate && (
            <KV label="Send by" value={action.payload.suggestedSendDate} />
          )}
        </>
      );
    case "draft_brand_post":
      return (
        <>
          <KV label="Body" value={truncate(action.payload.body, 280)} />
          {action.payload.suggestedPublishDate && (
            <KV label="Post on" value={action.payload.suggestedPublishDate} />
          )}
          <KV label="Rationale" value={action.payload.rationale} />
        </>
      );
    case "propose_code_change":
      return (
        <>
          <KV label="Title" value={action.payload.title} />
          <KV label="Description" value={action.payload.description} />
        </>
      );
    case "create_author":
      return (
        <>
          <KV label="Display name" value={action.payload.displayName} />
          <KV label="Role" value={action.payload.role} />
          {action.payload.credentials.length > 0 && (
            <KV label="Credentials" value={action.payload.credentials.join(", ")} />
          )}
        </>
      );
    case "add_nap_block":
      return (
        <>
          <KV label="Legal name" value={action.payload.legalName} />
          <KV label="Address" value={action.payload.address} />
          <KV label="Phone" value={action.payload.phone} />
        </>
      );
    case "update_offsite_profile":
      return (
        <KV label="Fields" value={Object.keys(action.payload.fieldsToUpdate).join(", ") || "—"} />
      );
    case "update_page":
      return (
        <>
          <KV label="Operation" value={action.target.operation} />
          {action.payload.newBodyMarkdown && (
            <KV label="New body" value={`${action.payload.newBodyMarkdown.length} chars`} />
          )}
        </>
      );
    case "assign_author":
      return <KV label="Author" value={`@${action.target.authorUsername}`} />;
    default: {
      const _exhaustive: never = action;
      return <KV label="payload" value={JSON.stringify(_exhaustive)} />;
    }
  }
}

// ── Tiny key-value renderer ─────────────────────────────────────────────

function KV({ label, value }: { label: string; value: string | null }): React.JSX.Element {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3">
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{label}</span>
      <span className="break-words text-foreground">{value ?? "—"}</span>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
