/**
 * Render an ExecutionManifest as human-readable Markdown.
 *
 * Mirrors the audit.md / strategy.md pattern — every JSON artifact gets a
 * paired .md for humans to skim. Grouped by channel + action type so a
 * reviewer can scan "all CMS work" or "all outreach drafts" in one block.
 */

import type {
  ExecutionAction,
  ExecutionManifest,
} from "../schema/execution-manifest.js";

// ── Per-action renderers ─────────────────────────────────────────────────────
//
// Each action type gets a compact one-block summary: target on top, payload
// fields below, provenance on the bottom. Long fields (markdown bodies,
// JSON-LD) are truncated with a (length) hint so the .md stays scannable.

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function renderBaseHeader(action: ExecutionAction): string[] {
  const auto = action.automatable ? "auto" : "human";
  return [
    `### \`${action.id}\` · ${action.type}`,
    `- **Status:** ${action.status}  ·  **Risk:** ${action.risk}  ·  **Channel:** ${action.channel}  ·  **${auto}**`,
    `- **Source:** ${action.provenance.source} \`${action.provenance.sourceId}\` — ${action.provenance.reason}`,
  ];
}

function renderActionBody(action: ExecutionAction): string[] {
  switch (action.type) {
    case "create_page":
      return [
        `- **Slug:** \`${action.target.slug}\`  ·  type: ${action.target.pageType}`,
        `- **Title:** ${action.payload.title}`,
        `- **Meta:** ${action.payload.metaDescription ?? "_unset_"}`,
        `- **Body:** ${action.payload.bodyMarkdown.length} chars`,
      ];
    case "update_page":
      return [
        `- **URL:** ${action.target.url}  ·  ${action.target.operation}`,
        ...(action.payload.newBodyMarkdown
          ? [`- **New body:** ${action.payload.newBodyMarkdown.length} chars`]
          : []),
        ...(action.payload.addSections.length > 0
          ? [`- **Adds ${action.payload.addSections.length} sections**`]
          : []),
        ...(action.payload.consolidateFromUrls.length > 0
          ? [`- **Consolidates from:** ${action.payload.consolidateFromUrls.join(", ")}`]
          : []),
      ];
    case "update_meta":
      return [
        `- **URL:** ${action.target.url}`,
        `- **Title:** ${action.payload.title ?? "_unset_"}`,
        `- **Meta:** ${action.payload.metaDescription ?? "_unset_"}`,
        ...(action.payload.canonical ? [`- **Canonical:** ${action.payload.canonical}`] : []),
      ];
    case "add_redirect":
      return [
        `- **From:** ${action.target.sourceUrl}`,
        `- **To:** ${action.target.targetUrl}`,
        `- **Code:** ${action.payload.statusCode}`,
      ];
    case "inject_schema":
      return [
        `- **URL:** ${action.target.url}`,
        `- **Type:** ${action.target.schemaType}  ·  ${action.target.location}`,
        `- **JSON-LD:** ${truncate(JSON.stringify(action.payload.jsonLd), 200)}`,
      ];
    case "insert_internal_link":
      return [
        `- **From:** ${action.target.sourceUrl}`,
        `- **To:** ${action.target.targetUrl}`,
        `- **Anchor:** "${action.payload.anchorText}"`,
      ];
    case "create_author":
      return [
        `- **Username:** ${action.target.username}`,
        `- **Display name:** ${action.payload.displayName}`,
        `- **Role:** ${action.payload.role}`,
        ...(action.payload.linkedinUrl ? [`- **LinkedIn:** ${action.payload.linkedinUrl}`] : []),
      ];
    case "assign_author":
      return [
        `- **Post:** ${action.target.postUrl}`,
        `- **Author:** ${action.target.authorUsername}`,
      ];
    case "add_nap_block":
      return [
        `- **URL:** ${action.target.url}`,
        `- **${action.payload.legalName}** · ${action.payload.address}`,
        `- **Phone:** ${action.payload.phone}`,
        ...(action.payload.email ? [`- **Email:** ${action.payload.email}`] : []),
      ];
    case "create_image":
      return [
        `- **Purpose:** ${action.target.purpose}  ·  ${action.payload.width}×${action.payload.height}`,
        `- **Context:** ${action.target.contextSlug}`,
        `- **Prompt:** ${truncate(action.payload.prompt, 160)}`,
      ];
    case "create_document":
      return [
        `- **Format:** ${action.target.format}  ·  ${action.target.docType}`,
        `- **Title:** ${action.payload.title}`,
        ...(action.payload.distributionPlatforms.length > 0
          ? [`- **Distribute to:** ${action.payload.distributionPlatforms.join(", ")}`]
          : []),
      ];
    case "draft_brand_post":
      return [
        `- **Platform:** ${action.target.platform}${action.target.subPlatform ? ` / ${action.target.subPlatform}` : ""}`,
        `- **Suggested date:** ${action.payload.suggestedPublishDate ?? "_unscheduled_"}`,
        `- **Body:** ${truncate(action.payload.body, 200)}`,
      ];
    case "draft_outreach":
      return [
        `- **Recipient:** ${action.target.recipientName ?? "?"} (${action.target.recipientRole ?? "?"}) at ${action.target.recipientDomain}`,
        `- **Type:** ${action.target.outreachType}`,
        `- **Subject:** ${action.payload.subject}`,
        `- **Send by:** ${action.payload.suggestedSendDate ?? "_unscheduled_"}`,
      ];
    case "propose_code_change":
      return [
        `- **Repo:** ${action.target.repo}  ·  branch \`${action.target.branch}\``,
        `- **Title:** ${action.payload.title}`,
        `- **Reviewers:** ${action.payload.reviewers.join(", ") || "_unassigned_"}`,
      ];
    case "update_offsite_profile":
      return [
        `- **Platform:** ${action.target.platform}`,
        ...(action.target.profileUrl ? [`- **Profile:** ${action.target.profileUrl}`] : []),
        `- **Fields:** ${Object.keys(action.payload.fieldsToUpdate).join(", ")}`,
      ];
    default: {
      // Exhaustiveness check — compile error if a new action type is added
      // without updating this switch.
      const _exhaustive: never = action;
      return [`- _unknown action type_ ${JSON.stringify(_exhaustive)}`];
    }
  }
}

function renderAction(action: ExecutionAction): string {
  const lines = [...renderBaseHeader(action), ...renderActionBody(action)];
  if (action.notes) lines.push(`- _notes:_ ${action.notes}`);
  return lines.join("\n");
}

// ── Top-level renderer ───────────────────────────────────────────────────────

function renderSummary(m: ExecutionManifest): string {
  const s = m.summary;
  const typeLines = Object.entries(s.byType)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `- ${t}: ${n}`)
    .join("\n");
  const channelLines = Object.entries(s.byChannel)
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => `- ${c}: ${n}`)
    .join("\n");
  return [
    `## Summary`,
    ``,
    `Total actions: **${s.totalActions}**  ·  Auto: **${s.automatable}**  ·  Human approval: **${s.requiresHumanApproval}**`,
    ``,
    `### By type`,
    typeLines || "_(none)_",
    ``,
    `### By channel`,
    channelLines || "_(none)_",
    ``,
  ].join("\n");
}

export function executionManifestToMarkdown(manifest: ExecutionManifest): string {
  const lines: string[] = [
    `# Execution Manifest — ${manifest.domain}`,
    ``,
    `Generated: ${manifest.generatedAt}`,
    `Strategy source: \`${manifest.strategySource}\``,
    `Manifest version: ${manifest.manifestVersion}`,
    ``,
    renderSummary(manifest),
    `---`,
    ``,
    `## Actions`,
    ``,
  ];

  // Group actions by channel so a reviewer can skim "all CMS work" at once.
  const byChannel = new Map<string, ExecutionAction[]>();
  for (const a of manifest.actions) {
    const list = byChannel.get(a.channel) ?? [];
    list.push(a);
    byChannel.set(a.channel, list);
  }

  for (const [channel, actions] of byChannel) {
    lines.push(`### Channel: \`${channel}\` (${actions.length})`);
    lines.push("");
    for (const a of actions) {
      lines.push(renderAction(a));
      lines.push("");
    }
  }

  return lines.join("\n");
}
