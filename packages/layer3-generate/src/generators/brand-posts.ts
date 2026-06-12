/**
 * Brand-post generator — produces `draft_brand_post` ExecutionActions for
 * social and community platforms the client should publish on.
 *
 * Purpose: brand mentions across the web (LinkedIn, Reddit, Threads, X) feed
 * three SEO/AEO outcomes:
 *
 *   1. Authority / EEAT — third-party signal that the brand has a real voice
 *   2. AEO / GEO — LLMs cite places they encounter the brand. More mentions
 *      across diverse, credible sources → better LLM recall + citation.
 *   3. Direct traffic — social discovery drives readers to the site.
 *
 * Three signal sources:
 *
 *   1. Topic clusters with high `priorityScore` → LinkedIn thought-leadership
 *      posts (long-form, professional audience)
 *   2. Gap report `aiOverviewOpportunities` → Reddit discussion posts in
 *      relevant subreddits (low-friction, conversational)
 *   3. Quick wins → Threads / X posts (short, shareable)
 *
 * Drafts are NOT auto-posted. Each action has `automatable=false`. The human
 * reviews + posts from the client's own account.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
  TopicCluster,
} from "@rynk/core";
import type {
  DraftBrandPostAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface BrandPostGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Spread brand posts over a content calendar instead of dumping them all on
 * day one. ~2 posts per week is a reasonable cadence; we stagger by 3 days.
 */
function staggeredPostDate(indexFromZero: number): string {
  const date = new Date();
  date.setDate(date.getDate() + 3 + indexFromZero * 3);
  return date.toISOString().split("T")[0]!;
}

// ── Per-platform body builders ───────────────────────────────────────────────

function buildLinkedInPost(cluster: TopicCluster, client: ClientContext): string {
  const brand = client.legalEntity || client.domain;
  const keyword = cluster.pillarKeyword;
  const value = cluster.businessValueScore;
  return [
    `${keyword} keeps coming up in conversations with our customers — but most of the public conversation oversimplifies it.`,
    ``,
    `Three things we've learned working with ${client.icp || "teams in our space"}:`,
    ``,
    `1. The ROI window is shorter than people assume. Concrete numbers from a recent engagement: ~30% reduction in cycle time, payback inside 90 days.`,
    `2. The bottleneck is rarely the tech — it's the change management around it.`,
    `3. ${cluster.spokeKeywords[0] ? `${cluster.spokeKeywords[0]} is the gateway use case` : `Start narrow, expand on signal`}.`,
    ``,
    `Curious how others are thinking about this. What's your single biggest open question on ${keyword}?`,
    ``,
    `#${keyword.replace(/\s+/g, "")} #${client.industry?.replace(/\s+/g, "") || "SEO"}`,
  ].join("\n");
}

function buildRedditPost(opportunity: string, client: ClientContext): { subreddit: string; body: string } {
  const brand = client.legalEntity || client.domain;
  // Heuristic subreddit pick — real implementation would use an industry map.
  const subreddit = client.industry?.toLowerCase().includes("saas")
    ? "r/SaaS"
    : client.industry?.toLowerCase().includes("ecom")
      ? "r/ecommerce"
      : "r/smallbusiness";
  const body = [
    `**${opportunity} — what's actually working in 2026?**`,
    ``,
    `Posting this because I've watched a lot of advice on ${opportunity} go stale fast, and I think the community can do better than the LinkedIn-influencer takes floating around.`,
    ``,
    `What's worked in my world (running ${brand}):`,
    `- [share one concrete tactic — fill in before posting]`,
    `- [share one concrete tactic — fill in before posting]`,
    `- [share one anti-pattern — fill in before posting]`,
    ``,
    `Genuinely curious what others have tried. Not pitching anything, just trying to learn from people who've actually been in the weeds.`,
  ].join("\n");
  return { subreddit, body };
}

function buildThreadsPost(quickWin: string, client: ClientContext): string {
  return [
    `Unpopular take from doing SEO for ${client.industry || "B2B teams"}:`,
    ``,
    `${quickWin}`,
    ``,
    `Most teams overcomplicate this. Start there.`,
  ].join("\n");
}

// ── Per-source action builders ───────────────────────────────────────────────

function buildLinkedInActionFromCluster(
  cluster: TopicCluster,
  client: ClientContext,
  id: string,
  postDate: string,
): DraftBrandPostAction {
  return {
    id,
    type: "draft_brand_post",
    status: "pending",
    risk: "low",
    channel: "social",
    automatable: false,
    provenance: {
      source: "cluster",
      sourceId: cluster.name,
      reason: `Topic cluster "${cluster.name}" (priorityScore=${cluster.priorityScore})`,
    },
    notes: `Edit the bullet points with real numbers before posting. Generic version below.`,
    target: { platform: "linkedin" },
    payload: {
      body: buildLinkedInPost(cluster, client),
      suggestedPublishDate: postDate,
      rationale: `Builds authority around "${cluster.pillarKeyword}" — supports the cluster's organic ranking and reinforces LLM brand recall.`,
      imageActionIds: [],
    },
  };
}

function buildRedditActionFromAIOverviewGap(
  opportunity: string,
  client: ClientContext,
  id: string,
  postDate: string,
): DraftBrandPostAction {
  const { subreddit, body } = buildRedditPost(opportunity, client);
  return {
    id,
    type: "draft_brand_post",
    status: "pending",
    risk: "medium",
    channel: "social",
    automatable: false,
    provenance: {
      source: "gap-report",
      sourceId: opportunity,
      reason: "AI Overview opportunity — Reddit discussions frequently surface as LLM citations",
    },
    notes:
      "Fill in the three concrete bullets before posting. Reddit penalizes promotional posts — keep it genuinely useful and never link to the brand site in this post.",
    target: { platform: "reddit", subPlatform: subreddit },
    payload: {
      body,
      suggestedPublishDate: postDate,
      rationale: `Targets "${opportunity}" — Reddit threads commonly surface in Google AI Overviews and ChatGPT citations.`,
      imageActionIds: [],
    },
  };
}

function buildThreadsActionFromQuickWin(
  quickWin: string,
  client: ClientContext,
  id: string,
  postDate: string,
): DraftBrandPostAction {
  return {
    id,
    type: "draft_brand_post",
    status: "pending",
    risk: "low",
    channel: "social",
    automatable: false,
    provenance: {
      source: "gap-report",
      sourceId: quickWin,
      reason: `Quick-win opportunity from Layer 2 gap report`,
    },
    notes: "Strong contrarian opener works on Threads — soften if the take doesn't match your actual position.",
    target: { platform: "threads" },
    payload: {
      body: buildThreadsPost(quickWin, client),
      suggestedPublishDate: postDate,
      rationale: "Threads visibility supplements brand mentions surfaced by LLMs.",
      imageActionIds: [],
    },
  };
}

// ── Public generator ─────────────────────────────────────────────────────────

export function generateBrandPostActions(opts: BrandPostGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "post";
  const out: DraftBrandPostAction[] = [];
  let counter = 1;

  // 1. LinkedIn — one per top-priority cluster (cap to top 5 to avoid noise)
  const topClusters = [...opts.strategy.topicClusterMap]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);
  let day = 0;
  for (const cluster of topClusters) {
    out.push(
      buildLinkedInActionFromCluster(
        cluster,
        opts.client,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredPostDate(day++),
      ),
    );
  }

  // 2. Reddit — one per AI Overview opportunity (cap to top 3)
  for (const opp of opts.strategy.gapReport.aiOverviewOpportunities.slice(0, 3)) {
    out.push(
      buildRedditActionFromAIOverviewGap(
        opp,
        opts.client,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredPostDate(day++),
      ),
    );
  }

  // 3. Threads — one per quick win (cap to top 3)
  for (const quick of opts.strategy.gapReport.quickWins.slice(0, 3)) {
    out.push(
      buildThreadsActionFromQuickWin(
        quick,
        opts.client,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredPostDate(day++),
      ),
    );
  }

  return out;
}
