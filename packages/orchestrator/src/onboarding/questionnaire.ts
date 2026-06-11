/**
 * Gap-filling questionnaire — terminal UX that asks the human ONLY for fields
 * the auto-fill step couldn't resolve.
 *
 * Runs after autoFillGaps() and only if there are remaining gaps. The
 * questionnaire is targeted — it never asks for fields rynk already has.
 * Empty answers are skipped (the field keeps its current value).
 *
 * For an established + optimized site (e.g. itechdata.ai) this questionnaire
 * runs zero questions because completeness=100 and no gaps remain.
 * For an established-but-unoptimized site, it might ask 2-4 things.
 * For a brand new site, it might ask 6-8 things.
 *
 * Same single pipeline, just adapts what it asks. No branching, no modes.
 */

import { createInterface } from "node:readline";
import type { ClientContext } from "@rynk/core";
import type { FieldGap } from "./completeness.js";

// ── Prompt config per field ───────────────────────────────────────────────────

/**
 * Maps a ClientContext field path → human-friendly question + parser.
 * Centralized here so a new field only requires adding one entry.
 */
interface QuestionConfig {
  /** Field path (matches FieldGap.field). */
  field: string;
  /** Question shown to the human. */
  prompt: string;
  /** Multiline guidance shown above the prompt. Optional. */
  hint?: string;
  /** Whether the answer should be split on commas into an array. */
  multi: boolean;
  /** Parser to turn the raw input into the right ClientContext patch. */
  apply: (ctx: ClientContext, raw: string) => ClientContext;
}

function splitList(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const QUESTIONS: QuestionConfig[] = [
  {
    field: "legalEntity",
    prompt: "Full legal business name",
    multi: false,
    apply: (ctx, raw) => ({ ...ctx, legalEntity: raw.trim() }),
  },
  {
    field: "industry",
    prompt: "Primary industry (e.g. 'SaaS for healthcare', 'B2B data services')",
    multi: false,
    apply: (ctx, raw) => ({ ...ctx, industry: raw.trim() }),
  },
  {
    field: "verticals",
    prompt: "Verticals / customer industries you serve, comma-separated",
    multi: true,
    apply: (ctx, raw) => ({ ...ctx, verticals: splitList(raw) }),
  },
  {
    field: "icp",
    prompt: "Ideal Customer Profile — describe in 1-2 sentences",
    hint: "Who's your perfect customer? Company size, role, pain point.",
    multi: false,
    apply: (ctx, raw) => ({ ...ctx, icp: raw.trim() }),
  },
  {
    field: "competitors",
    prompt: "Main competitors, comma-separated (domain names preferred)",
    hint: "Up to 5. Use bare domains like 'rossum.ai, hyperscience.com'.",
    multi: true,
    apply: (ctx, raw) => ({ ...ctx, competitors: splitList(raw) }),
  },
  {
    field: "certificationsClaimed",
    prompt: "Certifications, awards, or credentials (comma-separated, blank if none)",
    multi: true,
    apply: (ctx, raw) => ({ ...ctx, certificationsClaimed: splitList(raw) }),
  },
  {
    field: "seedKeywords",
    prompt: "Keywords your customers search for, comma-separated",
    hint: "Try 5-10 terms. We'll expand them automatically afterwards.",
    multi: true,
    apply: (ctx, raw) => ({ ...ctx, seedKeywords: splitList(raw) }),
  },
  {
    field: "goals",
    prompt: "Your top SEO goals, comma-separated",
    hint: "E.g. 'rank for X', 'grow inbound leads by 30%', 'establish EEAT for healthcare content'.",
    multi: true,
    apply: (ctx, raw) => ({ ...ctx, goals: splitList(raw) }),
  },
  {
    field: "canonicalNAP.address",
    prompt: "Business address (street, city, state, ZIP)",
    multi: false,
    apply: (ctx, raw) => ({
      ...ctx,
      canonicalNAP: { ...ctx.canonicalNAP, address: raw.trim() },
    }),
  },
  {
    field: "canonicalNAP.phone",
    prompt: "Business phone number",
    multi: false,
    apply: (ctx, raw) => ({
      ...ctx,
      canonicalNAP: { ...ctx.canonicalNAP, phone: raw.trim() },
    }),
  },
  {
    field: "canonicalNAP.email",
    prompt: "Business contact email",
    multi: false,
    apply: (ctx, raw) => ({
      ...ctx,
      canonicalNAP: { ...ctx.canonicalNAP, email: raw.trim() },
    }),
  },
];

const QUESTION_BY_FIELD = new Map(QUESTIONS.map((q) => [q.field, q] as const));

// ── Terminal helpers ──────────────────────────────────────────────────────────

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function describeCurrent(value: unknown): string {
  if (value === null || value === undefined) return "(blank)";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "(empty)";
  if (typeof value === "string") return value.length > 0 ? value : "(blank)";
  return String(value);
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface RunQuestionnaireOptions {
  ctx: ClientContext;
  /** Gaps the auto-fill step couldn't resolve. */
  remainingGaps: FieldGap[];
  /** If true, run even if every gap is human-required — useful for explicit re-onboarding. */
  alwaysRun?: boolean;
}

export interface RunQuestionnaireResult {
  ctx: ClientContext;
  /** Fields the human actually provided answers for. */
  answeredFields: string[];
  /** Fields the human skipped (pressed Enter). Kept as gaps. */
  skippedFields: string[];
}

/**
 * Walk the remaining gaps. For each one with a question config, prompt the
 * human. Empty answers are treated as "skip — keep current value".
 *
 * Returns the updated ctx + record of what was answered/skipped.
 */
export async function runQuestionnaire(
  opts: RunQuestionnaireOptions,
): Promise<RunQuestionnaireResult> {
  if (opts.remainingGaps.length === 0 && !opts.alwaysRun) {
    return { ctx: opts.ctx, answeredFields: [], skippedFields: [] };
  }

  // Dedup gaps by field (assessor may emit one per logical field).
  const seen = new Set<string>();
  const uniqueGaps = opts.remainingGaps.filter((g) => {
    if (seen.has(g.field)) return false;
    seen.add(g.field);
    return true;
  });

  process.stdout.write(
    "\n" +
      `  ╔══════════════════════════════════════════════════════════════════╗\n` +
      `  ║  rynk.ai — Filling in the gaps (${uniqueGaps.length.toString().padStart(2, " ")} fields)                       ║\n` +
      `  ╚══════════════════════════════════════════════════════════════════╝\n\n` +
      `  We couldn't extract everything from the site. Please fill in what\n` +
      `  you can. Press Enter to skip any field — we'll work with what we have.\n\n`,
  );

  let ctx = opts.ctx;
  const answered: string[] = [];
  const skipped: string[] = [];

  for (const gap of uniqueGaps) {
    const config = QUESTION_BY_FIELD.get(gap.field);
    if (!config) {
      // No question defined for this field (e.g. team/sprint defaults) — skip silently.
      continue;
    }

    const currentDisplay = describeCurrent(getFieldValue(ctx, gap.field));

    if (config.hint) {
      process.stdout.write(`  ── ${config.field} ─────────────────────────────────────\n`);
      process.stdout.write(`  ${config.hint}\n`);
    } else {
      process.stdout.write(`  ── ${config.field} ─────────────────────────────────────\n`);
    }
    process.stdout.write(`  Current: ${currentDisplay}\n`);
    const raw = await ask(`  ${config.prompt}: `);
    process.stdout.write("\n");

    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      skipped.push(config.field);
      continue;
    }
    ctx = config.apply(ctx, trimmed);
    answered.push(config.field);
  }

  return { ctx, answeredFields: answered, skippedFields: skipped };
}

// ── Field path access (handles dotted paths like "canonicalNAP.address") ─────

function getFieldValue(ctx: ClientContext, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = ctx;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
