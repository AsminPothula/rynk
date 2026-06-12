/**
 * Outreach generator — produces `draft_outreach` ExecutionActions for the
 * human SEO team to personalize and send.
 *
 * Three sources feed this:
 *
 *   1. Gap report → guest-post pitches. Each gap is a content area where
 *      a competitor outranks the client. The pitch positions the client as
 *      a contributing voice on that competitor's blog or related media.
 *
 *   2. Press / authority roadmap → press pitches. Layer 2's
 *      authorityRoadmap.prPitchTargets lists publications worth pitching;
 *      we draft an opening message per target.
 *
 *   3. Competitor analysis → backlink-request drafts. For competitors
 *      surfaced in offsiteEEAT.competitors, draft an outreach asking for a
 *      link exchange or mention.
 *
 * Each action carries: who to email (recipient domain), what to say
 * (subject + body), when (suggested send date 1-2 weeks out, staggered).
 *
 * All `automatable=false` — drafts go to the human queue, never auto-sent.
 * The human reviews, personalises, and sends from their own email.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  DraftOutreachAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface OutreachGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Stagger outreach sends so the team isn't sending 20 emails on day one.
 * Returns an ISO date N business days from today.
 */
function staggeredSendDate(indexFromZero: number): string {
  const date = new Date();
  // 2 business days per outreach, rough — every 3 calendar days
  date.setDate(date.getDate() + 7 + indexFromZero * 3);
  return date.toISOString().split("T")[0]!;
}

// ── Domain helpers ───────────────────────────────────────────────────────────

function normalizeDomain(input: string): string {
  return input
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "")
    .toLowerCase();
}

// ── Per-action builders ──────────────────────────────────────────────────────

interface GuestPostTarget {
  competitorDomain: string;
  topic: string;
  reason: string;
}

function buildGuestPostPitch(
  client: ClientContext,
  target: GuestPostTarget,
  id: string,
  sendDate: string,
): DraftOutreachAction {
  const brand = client.legalEntity || client.domain;
  const subject = `Guest contribution on ${target.topic}?`;
  const body = [
    `Hi there,`,
    ``,
    `I came across your coverage of ${target.topic} on ${target.competitorDomain} and wanted to reach out.`,
    ``,
    `I lead SEO/content at ${brand}. We've published deeply on ${target.topic} ourselves — ${client.icp ? "specifically for " + client.icp : "with real data from production deployments"} — and we'd love to contribute a perspective your readers haven't seen yet.`,
    ``,
    `Quick angle ideas:`,
    `  - A practitioner's view on ${target.topic} (what actually breaks at scale)`,
    `  - ${target.topic} ROI benchmarks from real client data`,
    `  - The lesser-discussed risks teams hit in the first 90 days`,
    ``,
    `Happy to send a full outline if any of these are interesting. Either way, great work on the existing coverage.`,
    ``,
    `Best,`,
    `${brand}`,
  ].join("\n");

  return {
    id,
    type: "draft_outreach",
    status: "pending",
    risk: "low",
    channel: "outreach",
    automatable: false,
    provenance: {
      source: "gap-report",
      sourceId: target.topic,
      reason: target.reason,
    },
    notes: "Personalize the angle bullets. Subject line A/B is worth testing.",
    target: {
      recipientDomain: target.competitorDomain,
      recipientName: null,
      recipientRole: "Editor / Content Lead",
      outreachType: "guest-post-pitch",
    },
    payload: {
      subject,
      body,
      suggestedSendDate: sendDate,
      followUpActionIds: [],
    },
  };
}

function buildPressPitch(
  client: ClientContext,
  target: string,
  id: string,
  sendDate: string,
): DraftOutreachAction {
  const brand = client.legalEntity || client.domain;
  const subject = `Story idea: practitioner data on ${client.industry || "your beat"}`;
  const body = [
    `Hi ${target} team,`,
    ``,
    `Quick pitch: I run ${brand} and we sit on a unique dataset around ${client.industry || "our space"} — specifically, outcomes from clients working with ${client.icp || "mid-market teams"}.`,
    ``,
    `A few story hooks I think your readers would value:`,
    `  - Real ROI numbers (most coverage in this space is vendor-marketing math)`,
    `  - The unspoken implementation traps`,
    `  - What's actually happening with AI/automation adoption in the field`,
    ``,
    `Happy to be a primary source, set up an interview, or share underlying data. Quote, story, or backgrounder — whatever's useful.`,
    ``,
    `Best,`,
    `${brand}`,
  ].join("\n");

  return {
    id,
    type: "draft_outreach",
    status: "pending",
    risk: "low",
    channel: "outreach",
    automatable: false,
    provenance: {
      source: "authority-roadmap",
      sourceId: target,
      reason: "Listed in Layer 2 authorityRoadmap.prPitchTargets",
    },
    notes: "Find a specific reporter who covers this beat before sending. Generic 'pitch desk' emails get ignored.",
    target: {
      recipientDomain: normalizeDomain(target),
      recipientName: null,
      recipientRole: "Reporter / Editor",
      outreachType: "press-pitch",
    },
    payload: {
      subject,
      body,
      suggestedSendDate: sendDate,
      followUpActionIds: [],
    },
  };
}

function buildBacklinkRequest(
  client: ClientContext,
  competitorDomain: string,
  reason: string,
  id: string,
  sendDate: string,
): DraftOutreachAction {
  const brand = client.legalEntity || client.domain;
  const subject = `Quick mention idea — ${brand} resource`;
  const body = [
    `Hi,`,
    ``,
    `I noticed your piece touches on a topic we cover in depth at ${brand}. Specifically, we maintain an up-to-date resource that I think would strengthen the section.`,
    ``,
    `Reasonable trade-off: if you find the resource useful, a link makes sense; if not, no worries.`,
    ``,
    `Open to suggestions, edits, or even a quick guest paragraph if that's more your style.`,
    ``,
    `Thanks,`,
    `${brand}`,
  ].join("\n");

  return {
    id,
    type: "draft_outreach",
    status: "pending",
    risk: "low",
    channel: "outreach",
    automatable: false,
    provenance: {
      source: "audit-issue",
      sourceId: `competitor:${competitorDomain}`,
      reason,
    },
    notes: "Send only if the linked piece is genuinely improved by our resource. Spammy version of this email gets us blocklisted.",
    target: {
      recipientDomain: competitorDomain,
      recipientName: null,
      recipientRole: "Content / SEO Lead",
      outreachType: "backlink-request",
    },
    payload: {
      subject,
      body,
      suggestedSendDate: sendDate,
      followUpActionIds: [],
    },
  };
}

// ── Public generator ─────────────────────────────────────────────────────────

export function generateOutreachActions(opts: OutreachGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "out";
  const out: DraftOutreachAction[] = [];
  let counter = 1;

  // 1. Gap report → guest-post pitches
  const guestTargets: GuestPostTarget[] = [];
  for (const gap of opts.strategy.gapReport.missingPagesVsCompetitors) {
    const domain = normalizeDomain(gap.competitorUrl);
    if (!domain) continue;
    guestTargets.push({
      competitorDomain: domain,
      topic: gap.missingTopic,
      reason: `Gap report: competitor ${domain} has comprehensive coverage of "${gap.missingTopic}"`,
    });
  }
  for (let i = 0; i < guestTargets.length; i++) {
    out.push(
      buildGuestPostPitch(
        opts.client,
        guestTargets[i]!,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredSendDate(i),
      ),
    );
  }

  // 2. Authority roadmap → press pitches
  for (let i = 0; i < opts.strategy.authorityRoadmap.prPitchTargets.length; i++) {
    const target = opts.strategy.authorityRoadmap.prPitchTargets[i]!;
    out.push(
      buildPressPitch(
        opts.client,
        target,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredSendDate(guestTargets.length + i),
      ),
    );
  }

  // 3. Competitor analysis → backlink requests (cap at top 5 to avoid spam)
  const competitorDomains = Object.keys(opts.audit.competitorAnalysis).slice(0, 5);
  for (let i = 0; i < competitorDomains.length; i++) {
    const dom = competitorDomains[i]!;
    out.push(
      buildBacklinkRequest(
        opts.client,
        normalizeDomain(dom),
        `Competitor ${dom} surfaces in audit — explore a content collaboration`,
        `${prefix}-${String(counter++).padStart(3, "0")}`,
        staggeredSendDate(guestTargets.length + opts.strategy.authorityRoadmap.prPitchTargets.length + i),
      ),
    );
  }

  return out;
}
