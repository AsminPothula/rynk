/**
 * Demo pipeline script - the scripted sequence of events emitted by the
 * /api/pipeline/run endpoint when RYNK_DEMO_MODE is on.
 *
 * Total runtime is ~70 seconds, scaled to a demo-friendly length while
 * still feeling like a real pipeline run. Real-mode (subprocess spawn) is
 * a future swap behind the same env flag.
 *
 * Event shape:
 *   - `at`       absolute milliseconds since run start (script timeline)
 *   - `type`     "layer_start" | "log" | "layer_done" | "complete"
 *   - `layer`    pipeline layer (0-4), or undefined for `complete`
 *   - `name`     layer display name (for `layer_start` events)
 *   - `msg`      log line text (for `log` events)
 *   - `totalActions`  emitted with `complete` so the drawer can render
 *                     the "View N generated actions" button
 */

export type DemoEvent =
  | { at: number; type: "layer_start"; layer: 0 | 1 | 2 | 3 | 4; name: string }
  | { at: number; type: "log"; layer: 0 | 1 | 2 | 3 | 4; msg: string }
  | { at: number; type: "layer_done"; layer: 0 | 1 | 2 | 3 | 4 }
  | { at: number; type: "complete"; totalActions: number };

export const LAYER_NAMES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "Onboarding",
  1: "Audit",
  2: "Strategy",
  3: "Generate",
  4: "Publish",
};

export const DEMO_PIPELINE_SCRIPT: DemoEvent[] = [
  // Layer 0 - Onboarding (5s)
  { at: 0,     type: "layer_start", layer: 0, name: "Onboarding" },
  { at: 600,   type: "log", layer: 0, msg: "Scraping homepage and key pages..." },
  { at: 2200,  type: "log", layer: 0, msg: "Extracting NAP, industry, ICP, competitors..." },
  { at: 4000,  type: "log", layer: 0, msg: "Client profile written to client.json" },
  { at: 5000,  type: "layer_done", layer: 0 },

  // Layer 1 - Audit (17s)
  { at: 5500,  type: "layer_start", layer: 1, name: "Audit" },
  { at: 6500,  type: "log", layer: 1, msg: "Crawling site (62 / 230 pages)..." },
  { at: 8500,  type: "log", layer: 1, msg: "Crawling site (147 / 230 pages)..." },
  { at: 10500, type: "log", layer: 1, msg: "Crawling site (230 / 230 pages)..." },
  { at: 12000, type: "log", layer: 1, msg: "Fetching keyword metrics for 10 seeds..." },
  { at: 14000, type: "log", layer: 1, msg: "Fetching Domain Authority via Moz provider..." },
  { at: 16000, type: "log", layer: 1, msg: "Running offsite research agent..." },
  { at: 18500, type: "log", layer: 1, msg: "Running synthesis agent..." },
  { at: 21500, type: "log", layer: 1, msg: "Audit saved - 64 findings (10 P1, 28 P2, 26 P3)" },
  { at: 22500, type: "layer_done", layer: 1 },

  // Layer 2 - Strategy (11s)
  { at: 23000, type: "layer_start", layer: 2, name: "Strategy" },
  { at: 24000, type: "log", layer: 2, msg: "Reading audit findings + client context..." },
  { at: 25500, type: "log", layer: 2, msg: "Building topic cluster map..." },
  { at: 28000, type: "log", layer: 2, msg: "Generating 17 content briefs..." },
  { at: 31000, type: "log", layer: 2, msg: "Drafting cannibalization fix plan + authority roadmap..." },
  { at: 33000, type: "log", layer: 2, msg: "Strategy saved - 10 clusters, 17 briefs" },
  { at: 34000, type: "layer_done", layer: 2 },

  // Layer 3 - Generate (24s)
  { at: 34500, type: "layer_start", layer: 3, name: "Generate" },
  { at: 35500, type: "log", layer: 3, msg: "meta generator - 24 actions" },
  { at: 37500, type: "log", layer: 3, msg: "schema generator - 38 actions" },
  { at: 39500, type: "log", layer: 3, msg: "redirects generator - 8 actions" },
  { at: 41500, type: "log", layer: 3, msg: "internal-links generator - 47 actions" },
  { at: 43000, type: "log", layer: 3, msg: "NAP generator - 1 action" },
  { at: 44500, type: "log", layer: 3, msg: "content-skeleton generator - 17 actions" },
  { at: 46500, type: "log", layer: 3, msg: "outreach generator - 32 actions" },
  { at: 49000, type: "log", layer: 3, msg: "brand-post generator - 28 actions" },
  { at: 51500, type: "log", layer: 3, msg: "image generator - 24 actions" },
  { at: 54000, type: "log", layer: 3, msg: "code-PR generator - 12 actions" },
  { at: 56500, type: "log", layer: 3, msg: "document generator - 15 actions" },
  { at: 58000, type: "log", layer: 3, msg: "Manifest saved - 246 actions across 6 channels" },
  { at: 59000, type: "layer_done", layer: 3 },

  // Layer 4 - Publish (11s)
  { at: 59500, type: "layer_start", layer: 4, name: "Publish" },
  { at: 60500, type: "log", layer: 4, msg: "Loading execution manifest..." },
  { at: 62000, type: "log", layer: 4, msg: "Routing actions to adapters..." },
  { at: 64000, type: "log", layer: 4, msg: "WordPress adapter ready (2 live handlers)" },
  { at: 66000, type: "log", layer: 4, msg: "Image adapter ready (mock provider)" },
  { at: 68000, type: "log", layer: 4, msg: "246 actions queued for review" },
  { at: 69500, type: "layer_done", layer: 4 },

  // Done
  { at: 70000, type: "complete", totalActions: 246 },
];

/** Total runtime of the demo script in milliseconds. */
export const DEMO_PIPELINE_DURATION_MS =
  DEMO_PIPELINE_SCRIPT[DEMO_PIPELINE_SCRIPT.length - 1]!.at;
