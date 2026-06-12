/**
 * Execution Manifest — the contract between Layer 3 (generate) and Layer 4
 * (publish). Every change rynk plans to make for a client is one entry.
 *
 * Design principles:
 *
 *   1. Discriminated union on `type` — every action shape is type-safe,
 *      Zod-validated, and rejects malformed payloads at parse time.
 *
 *   2. Provenance every action — each action knows which audit issue or
 *      content brief produced it. Lets the dashboard show "this change came
 *      from P2-007" and lets us regenerate when strategy changes.
 *
 *   3. Status lifecycle — pending → staged → applied → done. Or → failed /
 *      skipped / rejected. Layer 4 walks the manifest and updates statuses.
 *
 *   4. Automatability flag — actions that can't be safely auto-applied (code
 *      changes, legal copy edits) are flagged so the orchestrator routes them
 *      to a human review channel instead of the CMS adapter.
 *
 *   5. Risk score — orchestrator and dashboard use this for batching approval
 *      requests: auto-approve everything ≤ low, batch medium, individually
 *      review high.
 *
 *   6. No CMS-specific fields here — adapters in Layer 4 map manifest
 *      actions to CMS REST calls. This file knows nothing about WordPress.
 */

import { z } from "zod";

// ─── Lifecycle + classification ──────────────────────────────────────────────

export const ActionStatusSchema = z.enum([
  "pending",
  "staged",
  "approved",
  "applied",
  "failed",
  "skipped",
  "rejected",
]);

export const ActionRiskSchema = z.enum(["low", "medium", "high"]);

/**
 * Where the action lives in rynk's logic. Helps the dashboard group actions
 * and helps Layer 4 route to the right adapter.
 */
export const ActionChannelSchema = z.enum([
  "cms",          // changes to the client's CMS (content, meta, schema, redirects)
  "code-pr",      // code-level changes that become a GitHub PR draft
  "outreach",     // emails/pitches the human will send
  "social",       // social posts the human will publish
  "document",     // PDFs, PPTs, downloads
  "image",        // AI-generated images
  "offsite",      // third-party platform changes (GBP, G2, Crunchbase)
]);

// ─── Provenance — what produced this action ──────────────────────────────────

export const ProvenanceSchema = z.object({
  /** "audit-issue", "content-brief", "cluster", "manual", etc. */
  source: z.enum([
    "audit-issue",
    "content-brief",
    "cluster",
    "cannibalization-fix",
    "gap-report",
    "authority-roadmap",
    "manual",
  ]),
  /** ID of the source object (e.g. "P2-007", "brief-015"). */
  sourceId: z.string(),
  /** Free-text explanation, shown in the dashboard tooltip. */
  reason: z.string(),
});

// ─── Common base fields shared by all actions ────────────────────────────────

const baseAction = {
  /** Unique within the manifest. Format: "act-{slug}-{n}" */
  id: z.string(),
  status: ActionStatusSchema.default("pending"),
  risk: ActionRiskSchema,
  channel: ActionChannelSchema,
  /** True if Layer 4 can apply this without explicit human approval. */
  automatable: z.boolean(),
  provenance: ProvenanceSchema,
  /** Free-text notes from the generator. Surfaced in the dashboard. */
  notes: z.string().default(""),
};

// ─── Action types — one schema per kind of change ────────────────────────────

/** Create a brand-new page or blog post in the CMS. */
export const CreatePageActionSchema = z.object({
  ...baseAction,
  type: z.literal("create_page"),
  target: z.object({
    slug: z.string().describe("URL path under the domain (e.g. '/solutions/x/')"),
    pageType: z.enum(["pillar", "spoke", "blog", "landing", "policy", "author"]),
    parentSlug: z.string().optional(),
  }),
  payload: z.object({
    title: z.string(),
    metaDescription: z.string().nullable(),
    /** Body as markdown — adapter converts to CMS-native blocks. */
    bodyMarkdown: z.string(),
    /** Optional structured outline if body isn't yet generated. */
    outline: z.array(z.object({ heading: z.string(), purpose: z.string() })).optional(),
    /** IDs of related image-generation actions to attach when applied. */
    imageActionIds: z.array(z.string()).default([]),
    /** IDs of related schema-injection actions to fire after page exists. */
    schemaActionIds: z.array(z.string()).default([]),
  }),
});

/** Update body content of an existing page (expand / consolidate / refresh). */
export const UpdatePageActionSchema = z.object({
  ...baseAction,
  type: z.literal("update_page"),
  target: z.object({
    url: z.string().url(),
    operation: z.enum(["expand", "consolidate", "refresh", "rewrite"]),
  }),
  payload: z.object({
    /** New full body (markdown) or a patch. */
    newBodyMarkdown: z.string().optional(),
    /** Replacement headings to add/swap. Used by "expand". */
    addSections: z.array(z.object({ h2: z.string(), body: z.string() })).default([]),
    /** URLs whose content should be merged in (for "consolidate"). */
    consolidateFromUrls: z.array(z.string()).default([]),
  }),
});

/** Update title / meta description / canonical for an existing URL. */
export const UpdateMetaActionSchema = z.object({
  ...baseAction,
  type: z.literal("update_meta"),
  target: z.object({ url: z.string().url() }),
  payload: z.object({
    title: z.string().nullable(),
    metaDescription: z.string().nullable(),
    canonical: z.string().nullable(),
    metaRobots: z.string().nullable(),
  }),
});

/** Add a 301 redirect from sourceUrl → targetUrl. */
export const AddRedirectActionSchema = z.object({
  ...baseAction,
  type: z.literal("add_redirect"),
  target: z.object({ sourceUrl: z.string().url(), targetUrl: z.string().url() }),
  payload: z.object({ statusCode: z.literal(301).or(z.literal(302)).default(301) }),
});

/** Inject (or replace) JSON-LD schema markup on a page. */
export const InjectSchemaActionSchema = z.object({
  ...baseAction,
  type: z.literal("inject_schema"),
  target: z.object({
    url: z.string().url(),
    /** Schema.org @type, e.g. "Organization", "Service", "FAQPage", "Article". */
    schemaType: z.string(),
    /** "sitewide" injects via theme/footer, "page" via the page itself. */
    location: z.enum(["sitewide", "page"]).default("page"),
  }),
  /** The actual JSON-LD object. Validated as plain JSON here. */
  payload: z.object({ jsonLd: z.record(z.string(), z.unknown()) }),
});

/** Insert an internal link inside an existing page's content. */
export const InsertInternalLinkActionSchema = z.object({
  ...baseAction,
  type: z.literal("insert_internal_link"),
  target: z.object({
    /** Page the anchor will live on. */
    sourceUrl: z.string().url(),
    /** Page being linked to. */
    targetUrl: z.string().url(),
  }),
  payload: z.object({
    anchorText: z.string(),
    /** Optional context snippet to help adapter find the insertion point. */
    nearbyText: z.string().optional(),
  }),
});

/** Create an author user in the CMS (for blog bylines). */
export const CreateAuthorActionSchema = z.object({
  ...baseAction,
  type: z.literal("create_author"),
  target: z.object({ username: z.string() }),
  payload: z.object({
    displayName: z.string(),
    bio: z.string(),
    role: z.string(),
    credentials: z.array(z.string()).default([]),
    linkedinUrl: z.string().url().nullable(),
    /** Action ID of an image-generation action for the headshot. */
    headshotImageActionId: z.string().nullable(),
  }),
});

/** Assign an existing post to an author (or change author). */
export const AssignAuthorActionSchema = z.object({
  ...baseAction,
  type: z.literal("assign_author"),
  target: z.object({ postUrl: z.string().url(), authorUsername: z.string() }),
  payload: z.object({}).default({}),
});

/** Add a NAP (Name / Address / Phone) block to a page. */
export const AddNAPBlockActionSchema = z.object({
  ...baseAction,
  type: z.literal("add_nap_block"),
  target: z.object({ url: z.string().url() }),
  payload: z.object({
    legalName: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email().nullable(),
    /** Whether to wrap in LocalBusiness schema. */
    includeLocalBusinessSchema: z.boolean().default(true),
  }),
});

/** Generate an AI image (hero, inline diagram, headshot). */
export const CreateImageActionSchema = z.object({
  ...baseAction,
  type: z.literal("create_image"),
  target: z.object({
    /** Logical purpose — drives prompt template + sizing. */
    purpose: z.enum(["hero", "inline-diagram", "headshot", "thumbnail", "social-card"]),
    /** Slug or page this image will attach to. */
    contextSlug: z.string(),
  }),
  payload: z.object({
    prompt: z.string(),
    altText: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    /** Once generated, where it landed (set by Layer 4 after image-gen runs). */
    resultUrl: z.string().url().nullable().default(null),
  }),
});

/** Generate a PDF or PPT document and stage it for distribution. */
export const CreateDocumentActionSchema = z.object({
  ...baseAction,
  type: z.literal("create_document"),
  target: z.object({
    format: z.enum(["pdf", "pptx"]),
    /** Logical name — drives template selection. */
    docType: z.enum(["whitepaper", "case-study", "deck", "one-pager"]),
  }),
  payload: z.object({
    title: z.string(),
    sourceContentUrl: z.string().url().nullable(),
    bodyMarkdown: z.string(),
    /** Distribution targets (SlideShare, Scribd, etc). Action IDs populated later. */
    distributionPlatforms: z.array(z.string()).default([]),
  }),
});

/** Draft a social/brand post for the client to publish. NOT auto-posted. */
export const DraftBrandPostActionSchema = z.object({
  ...baseAction,
  type: z.literal("draft_brand_post"),
  target: z.object({
    platform: z.enum(["linkedin", "twitter", "reddit", "threads", "blog"]),
    /** Optional sub-target like subreddit name. */
    subPlatform: z.string().optional(),
  }),
  payload: z.object({
    body: z.string(),
    suggestedPublishDate: z.string().nullable(),
    /** Why this post helps SEO/AEO (links back to provenance reason). */
    rationale: z.string(),
    /** IDs of image actions to attach. */
    imageActionIds: z.array(z.string()).default([]),
  }),
});

/** Draft an outreach email for backlinks / guest posts / HARO. */
export const DraftOutreachActionSchema = z.object({
  ...baseAction,
  type: z.literal("draft_outreach"),
  target: z.object({
    recipientDomain: z.string(),
    recipientName: z.string().nullable(),
    recipientRole: z.string().nullable(),
    outreachType: z.enum([
      "backlink-request",
      "guest-post-pitch",
      "haro-response",
      "podcast-pitch",
      "press-pitch",
      "partnership",
    ]),
  }),
  payload: z.object({
    subject: z.string(),
    body: z.string(),
    /** Suggested send date — drives sequencing in the orchestrator. */
    suggestedSendDate: z.string().nullable(),
    /** Follow-up email IDs (so a sequence is visible in the dashboard). */
    followUpActionIds: z.array(z.string()).default([]),
  }),
});

/** Propose a code-level change as a GitHub PR (e.g. page-speed fix). */
export const ProposeCodeChangeActionSchema = z.object({
  ...baseAction,
  type: z.literal("propose_code_change"),
  target: z.object({
    /** Repo URL or "client-theme" / "client-plugin" identifier. */
    repo: z.string(),
    /** Branch name suggestion (Layer 4 may rename). */
    branch: z.string(),
  }),
  payload: z.object({
    title: z.string(),
    description: z.string(),
    /** Diff or file-level instructions. Markdown formatted. */
    instructions: z.string(),
    /** Suggested reviewers. */
    reviewers: z.array(z.string()).default([]),
  }),
});

/** Update or create a profile on a third-party platform. */
export const UpdateOffsiteProfileActionSchema = z.object({
  ...baseAction,
  type: z.literal("update_offsite_profile"),
  target: z.object({
    platform: z.enum([
      "google-business-profile",
      "g2",
      "clutch",
      "capterra",
      "crunchbase",
      "linkedin",
      "wikidata",
      "bbb",
    ]),
    profileUrl: z.string().url().nullable(),
  }),
  payload: z.object({
    fieldsToUpdate: z.record(z.string(), z.string()),
    instructions: z.string(),
  }),
});

// ─── Discriminated union + manifest container ────────────────────────────────

export const ExecutionActionSchema = z.discriminatedUnion("type", [
  CreatePageActionSchema,
  UpdatePageActionSchema,
  UpdateMetaActionSchema,
  AddRedirectActionSchema,
  InjectSchemaActionSchema,
  InsertInternalLinkActionSchema,
  CreateAuthorActionSchema,
  AssignAuthorActionSchema,
  AddNAPBlockActionSchema,
  CreateImageActionSchema,
  CreateDocumentActionSchema,
  DraftBrandPostActionSchema,
  DraftOutreachActionSchema,
  ProposeCodeChangeActionSchema,
  UpdateOffsiteProfileActionSchema,
]);

export const ManifestSummarySchema = z.object({
  totalActions: z.number().int().nonnegative(),
  byType: z.record(z.string(), z.number().int().nonnegative()),
  byChannel: z.record(z.string(), z.number().int().nonnegative()),
  byStatus: z.record(z.string(), z.number().int().nonnegative()),
  automatable: z.number().int().nonnegative(),
  requiresHumanApproval: z.number().int().nonnegative(),
});

export const ExecutionManifestSchema = z.object({
  domain: z.string(),
  manifestVersion: z.literal("1.0"),
  generatedAt: z.string().describe("ISO 8601 timestamp"),
  /** Path/URL of the strategy.json that produced this manifest. */
  strategySource: z.string(),
  actions: z.array(ExecutionActionSchema),
  summary: ManifestSummarySchema,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionStatus = z.infer<typeof ActionStatusSchema>;
export type ActionRisk = z.infer<typeof ActionRiskSchema>;
export type ActionChannel = z.infer<typeof ActionChannelSchema>;
export type Provenance = z.infer<typeof ProvenanceSchema>;
export type CreatePageAction = z.infer<typeof CreatePageActionSchema>;
export type UpdatePageAction = z.infer<typeof UpdatePageActionSchema>;
export type UpdateMetaAction = z.infer<typeof UpdateMetaActionSchema>;
export type AddRedirectAction = z.infer<typeof AddRedirectActionSchema>;
export type InjectSchemaAction = z.infer<typeof InjectSchemaActionSchema>;
export type InsertInternalLinkAction = z.infer<typeof InsertInternalLinkActionSchema>;
export type CreateAuthorAction = z.infer<typeof CreateAuthorActionSchema>;
export type AssignAuthorAction = z.infer<typeof AssignAuthorActionSchema>;
export type AddNAPBlockAction = z.infer<typeof AddNAPBlockActionSchema>;
export type CreateImageAction = z.infer<typeof CreateImageActionSchema>;
export type CreateDocumentAction = z.infer<typeof CreateDocumentActionSchema>;
export type DraftBrandPostAction = z.infer<typeof DraftBrandPostActionSchema>;
export type DraftOutreachAction = z.infer<typeof DraftOutreachActionSchema>;
export type ProposeCodeChangeAction = z.infer<typeof ProposeCodeChangeActionSchema>;
export type UpdateOffsiteProfileAction = z.infer<typeof UpdateOffsiteProfileActionSchema>;
export type ExecutionAction = z.infer<typeof ExecutionActionSchema>;
export type ManifestSummary = z.infer<typeof ManifestSummarySchema>;
export type ExecutionManifest = z.infer<typeof ExecutionManifestSchema>;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Compute the summary block from a list of actions. Called by the manifest
 * builder after all generators have run.
 */
export function summarizeActions(actions: ExecutionAction[]): ManifestSummary {
  const byType: Record<string, number> = {};
  const byChannel: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let automatable = 0;
  let requiresHumanApproval = 0;

  for (const action of actions) {
    byType[action.type] = (byType[action.type] ?? 0) + 1;
    byChannel[action.channel] = (byChannel[action.channel] ?? 0) + 1;
    byStatus[action.status] = (byStatus[action.status] ?? 0) + 1;
    if (action.automatable) automatable += 1;
    else requiresHumanApproval += 1;
  }

  return {
    totalActions: actions.length,
    byType,
    byChannel,
    byStatus,
    automatable,
    requiresHumanApproval,
  };
}
