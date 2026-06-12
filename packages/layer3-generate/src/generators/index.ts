/**
 * Generator registry + composer.
 *
 * Each generator is a pure function (audit + strategy + client) → ExecutionAction[].
 * The composer runs them all and assembles the final ExecutionManifest.
 *
 * Adding a new generator (e.g. redirects, brand-posts) = write the file,
 * import here, add to the registry array. No other code changes.
 */

import { createLogger } from "@rynk/core";
import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import {
  type ExecutionAction,
  type ExecutionManifest,
  summarizeActions,
} from "../schema/execution-manifest.js";
import { generateMetaActions } from "./meta.js";
import { generateSchemaActions } from "./schema.js";
import { generateRedirectActions } from "./redirects.js";
import { generateInternalLinkActions } from "./internal-links.js";
import { generateNapBlockActions } from "./nap-block.js";
import { generateContentSkeletonActions } from "./content-skeleton.js";
import { generateOutreachActions } from "./outreach.js";
import { generateBrandPostActions } from "./brand-posts.js";
import { generateImageActions } from "./images.js";
import { generateCodePRActions } from "./code-prs.js";
import { generateDocumentActions } from "./documents.js";

const log = createLogger("layer3.compose");

export interface ComposeManifestOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  /** Path/URL of the strategy.json that triggered this manifest. */
  strategySource: string;
  /** Optional whitelist — only run these generators (for partial regens). */
  only?: GeneratorName[];
}

export type GeneratorName =
  | "meta"
  | "schema"
  | "redirects"
  | "internal-links"
  | "nap-block"
  | "content-skeleton"
  | "outreach"
  | "brand-posts"
  | "images"
  | "code-prs"
  | "documents";

/**
 * Each generator receives the opts plus the running list of actions
 * produced by generators that ran BEFORE it. Most generators ignore the
 * running list. Linking generators (e.g. images) use it to find upstream
 * actions and patch their payloads.
 */
interface RegisteredGenerator {
  name: GeneratorName;
  run: (opts: ComposeManifestOptions, priorActions: ExecutionAction[]) => ExecutionAction[];
}

/**
 * The single source of truth for which generators run. Add new ones here.
 * Order matters only insofar as later generators may reference action IDs
 * from earlier ones — none of these do yet.
 */
const REGISTRY: RegisteredGenerator[] = [
  {
    name: "meta",
    run: (opts) =>
      generateMetaActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "meta",
      }),
  },
  {
    name: "schema",
    run: (opts) =>
      generateSchemaActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "schema",
      }),
  },
  {
    name: "redirects",
    run: (opts) =>
      generateRedirectActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "redir",
      }),
  },
  {
    name: "internal-links",
    run: (opts) =>
      generateInternalLinkActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "link",
      }),
  },
  {
    name: "nap-block",
    run: (opts) =>
      generateNapBlockActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "nap",
      }),
  },
  {
    name: "content-skeleton",
    run: (opts) =>
      generateContentSkeletonActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "page",
      }),
  },
  {
    name: "outreach",
    run: (opts) =>
      generateOutreachActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "out",
      }),
  },
  {
    name: "brand-posts",
    run: (opts) =>
      generateBrandPostActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "post",
      }),
  },
  // Images run LAST among generators that emit linked actions. It walks the
  // accumulated priorActions list, finds create_page actions, and patches
  // their imageActionIds while emitting create_image actions of its own.
  {
    name: "images",
    run: (opts, priorActions) =>
      generateImageActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        priorActions,
        idPrefix: "img",
      }),
  },
  {
    name: "code-prs",
    run: (opts) =>
      generateCodePRActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "pr",
      }),
  },
  {
    name: "documents",
    run: (opts) =>
      generateDocumentActions({
        audit: opts.audit,
        strategy: opts.strategy,
        client: opts.client,
        idPrefix: "doc",
      }),
  },
];

/**
 * Compose the final ExecutionManifest by running every registered generator
 * and concatenating their actions. Pure function — no I/O, no LLM calls.
 *
 * Caller persists the manifest (e.g. to `runs/{domain}/{date}/execution-manifest.json`).
 */
export function composeManifest(opts: ComposeManifestOptions): ExecutionManifest {
  const generators = opts.only
    ? REGISTRY.filter((g) => opts.only!.includes(g.name))
    : REGISTRY;

  log.info("composing manifest", {
    domain: opts.client.domain,
    generators: generators.map((g) => g.name),
  });

  const actions: ExecutionAction[] = [];
  for (const gen of generators) {
    // Pass the running actions list so linking generators (images) can find
    // upstream actions and patch their payloads. Earlier generators receive
    // an empty array.
    const produced = gen.run(opts, actions);
    log.info("generator complete", { name: gen.name, actions: produced.length });
    actions.push(...produced);
  }

  return {
    domain: opts.client.domain,
    manifestVersion: "1.0",
    generatedAt: new Date().toISOString(),
    strategySource: opts.strategySource,
    actions,
    summary: summarizeActions(actions),
  };
}

export { generateMetaActions } from "./meta.js";
export { generateSchemaActions } from "./schema.js";
export { generateRedirectActions } from "./redirects.js";
export { generateInternalLinkActions } from "./internal-links.js";
export { generateNapBlockActions } from "./nap-block.js";
export { generateContentSkeletonActions } from "./content-skeleton.js";
export { generateOutreachActions } from "./outreach.js";
export { generateBrandPostActions } from "./brand-posts.js";
export { generateImageActions } from "./images.js";
export { generateCodePRActions } from "./code-prs.js";
export { generateDocumentActions } from "./documents.js";
