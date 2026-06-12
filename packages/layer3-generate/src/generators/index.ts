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

export type GeneratorName = "meta" | "schema";

interface RegisteredGenerator {
  name: GeneratorName;
  run: (opts: ComposeManifestOptions) => ExecutionAction[];
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
    const produced = gen.run(opts);
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
