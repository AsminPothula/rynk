# Layer 5 - Monitor: Build Brief

Build spec. Read the whole doc before starting. Everything is TypeScript, matches the existing package pattern in `packages/`.

---

## 1. What Layer 5 is

Layers 1-4 run once per client and produce audit → strategy → execution manifest → applied changes. Layer 5 is the **continuous monitor** that runs weekly (per client) forever after Layer 4 has shipped.

Layer 5 does four things:

1. **Re-fetch SERPs** for every target keyword each week, snapshot them.
2. **Detect deltas**: what changed between last week's SERP and this week's - new competitors in the top 10, our own rank movement, a competitor dropping off.
3. **Track owned-domain metrics**: pull fresh Google Search Console + Google Analytics + Domain Authority + backlink counts.
4. **Trigger a partial Layer 2 re-run** when the competitive landscape shifts enough to matter (e.g. a new competitor takes over position #1 for a target keyword).

Output: a weekly digest per client showing what moved, what got shipped in response, and what's next. This is the artifact the dashboard renders and (later) that gets emailed to the client, potentially.

## 2. Why it matters

SERPs are not static. A page that ranks today can lose position next week because a competitor updated theirs, Google updated its algorithm, or a new competitor entered. Without monitoring:

- Client wins get invisible (rank goes up but nobody notices, no case study data).
- Client losses go silent (competitor takes over, we react two months late).
- The pipeline can't self-correct - Layer 2 planned based on a stale view of the world.

Layer 5 closes the loop. It makes rynk a **continuous** system instead of a one-shot audit.

## 3. Where it fits in the codebase

Repo layout you already know:

```
packages/
  core/              shared clients, schemas, agent runner, file utils
  layer1-audit/
  layer2-strategy/
  layer3-generate/
  layer4-publish/
  layer5-monitor/    ← NEW - you create this
```

Language: **TypeScript**. Follow the exact same package structure as `layer1-audit`:

```
packages/layer5-monitor/
  package.json         name: "@rynk/layer5-monitor"
  tsconfig.json        extends the root tsconfig
  src/
    index.ts           top-level entry: runLayer5Monitor(domain)
    schema/            Zod schemas for snapshots + deltas + digest
    snapshots/         one file per snapshot type (serp, rank, gsc, ga, da, backlinks)
    diff/              delta detection between snapshots
    triggers/          calls back into Layer 2 when a re-strategy is needed
    jobs/              the "runner" functions each of you owns
    digest/            weekly rollup builder
```

Look at how `packages/layer1-audit/src/index.ts` exports its runner - copy the same pattern for `runLayer5Monitor`.

## 4. External tools + APIs

| Tool | What we use it for | API needed? | Status |
|---|---|---|---|
| SerpAPI (or DataForSEO) | Fetch weekly SERPs for target keywords | Yes | Already integrated in Layer 1. Reuse the client. |
| KeywordDataProvider | Refresh keyword volume/difficulty/DA + backlink counts | Yes | Interface exists in `packages/core/src/clients/`. Reuse. |
| Google Search Console | Impressions, clicks, queries, positions for owned domain | Yes (OAuth) | Client stub exists in `packages/core/src/clients/gsc.ts`. Currently returns mocks. |
| Google Analytics | Sessions, conversions per landing page | Yes (OAuth) | Client stub exists in `packages/core/src/clients/ga.ts`. Currently returns mocks. |
| Moz (optional) | Alternate DA source if we don't buy Ahrefs | Yes | Not integrated. Only build if the KeywordDataProvider doesn't cover DA. |
| Ahrefs backlink API (optional) | New/lost backlinks over time | Yes | Not integrated yet. Behind the KeywordDataProvider interface so we can swap. |

**Build against the interfaces, not the concrete APIs.** Every external call goes through a client in `packages/core/src/clients/`. If a real API key isn't in `.env`, the client returns mock data. This means you can build and test the whole layer 5 flow without any keys.

Once your structure is done and the interfaces are being called correctly, Asmin signs up for the paid tools and drops the API keys into `.env`. Your code doesn't change.

## 5. Branch strategy

Create one branch each off `main`. Name them:

```
layer5/<your-name>-serp-watch      ← Person 1
layer5/<your-name>-metrics         ← Person 2
```

Both branch off `main` today. Commit often on your own branch. Open a PR when your piece is done - each PR reviewed independently before merging back to a shared `layer5/integration` branch. Asmin merges to `main` only after both PRs land.

Do NOT branch off each other's branches. If you need something from the other person's code, coordinate on the shared file (the schema) and stub the other person's function so you can keep moving.

The shared file both of you touch: `packages/layer5-monitor/src/schema/`. Coordinate on that before either of you writes real code. See step 0 below.

## 6. Step 0 - Do this together (before splitting up)

Both of you sit together for one session and produce these three files:

### `packages/layer5-monitor/package.json`
Copy from `packages/layer1-audit/package.json`, change `name` and `description`. Same deps.

### `packages/layer5-monitor/tsconfig.json`
Copy from `packages/layer1-audit/tsconfig.json`. No changes.

### `packages/layer5-monitor/src/schema/index.ts`
Zod schemas for every artifact Layer 5 produces. Define these together so both of you write against the same shapes:

```ts
// A single SERP snapshot for one keyword at one point in time
SerpSnapshotSchema
  domain, keyword, takenAt,
  results: [{ position, url, title, description, domain }]

// Owned-domain rank for a keyword at a point in time
RankSnapshotSchema
  domain, keyword, takenAt, rank (int or null), ai_engine ('google' | 'chatgpt' | 'perplexity' | ...)

// GSC pull for one week
GscSnapshotSchema
  domain, weekStarting, impressions, clicks, avgPosition,
  topQueries: [{ query, impressions, clicks, position }]

// GA pull for one week
GaSnapshotSchema
  domain, weekStarting, sessions, conversions,
  topPages: [{ url, sessions, conversions }]

// Domain Authority snapshot
DaSnapshotSchema
  domain, takenAt, da, source ('moz' | 'ahrefs')

// Backlink snapshot
BacklinkSnapshotSchema
  domain, takenAt, totalBacklinks, referringDomains,
  newSinceLast: [{ url, referringDomain, firstSeen }],
  lostSinceLast: [{ url, referringDomain, lastSeen }]

// The output of a delta comparison between two SERP snapshots
SerpDeltaSchema
  keyword, from, to,
  newInTop10: [{ url, position }],
  droppedFromTop10: [{ url, lastPosition }],
  positionChanges: [{ url, from, to }],
  triggerRestrategy: boolean, triggerReason: string | null

// The weekly digest that rolls everything up for a client
WeeklyDigestSchema
  domain, weekStarting, weekEnding,
  keywordCount, rankGains, rankLosses, newCompetitors,
  gscTrend, gaTrend, daChange, backlinkChange,
  actionsRecommended: [{ keyword, reason }]
```

Once these are defined and exported, split up.

## 7. Snapshot storage convention

Both of you write to the same location under `runs/`:

```
runs/{safeDomain}/monitor/
  serp/
    {keyword-slug}/{YYYY-MM-DD}.json     ← one per keyword per week
  rank/{YYYY-MM-DD}.json                  ← all keywords, one file per week
  gsc/{YYYY-MM-DD}.json
  ga/{YYYY-MM-DD}.json
  da/{YYYY-MM-DD}.json
  backlinks/{YYYY-MM-DD}.json
  digest/{YYYY-MM-DD}.json
```

Use `writeJson` from `@rynk/core/utils/files` (exact same helper Layers 1-2 use). Never write custom file I/O.

## 8. Person 1 - SERP watch + delta detection + re-strategy trigger

You own the **external world**: what's out there in the SERPs and how it changed.

### Files you create

```
src/snapshots/serp-snapshot.ts
src/diff/serp-diff.ts
src/triggers/restrategy-trigger.ts
src/jobs/serp-watch.ts
```

### Files + functions in detail

**`src/snapshots/serp-snapshot.ts`**
```ts
export async function takeSerpSnapshot(
  domain: string,
  keyword: string,
  runsDir: string,
): Promise<SerpSnapshot>
```
Calls the existing SerpAPI client. Fetches the top 10 for the keyword. Serialises to `SerpSnapshotSchema`. Writes to `runs/{domain}/monitor/serp/{keyword-slug}/{date}.json`. Returns the snapshot.

**`src/diff/serp-diff.ts`**
```ts
export function computeSerpDelta(
  previous: SerpSnapshot,
  current: SerpSnapshot,
): SerpDelta
```
Pure function, no I/O. Compares two snapshots, produces the `SerpDeltaSchema` shape:
- `newInTop10` - URLs in current top 10 that weren't in previous top 10
- `droppedFromTop10` - URLs in previous top 10 but not current
- `positionChanges` - URLs in both, with their old and new position
- `triggerRestrategy` - `true` if (a) a brand new URL is now in top 3, OR (b) our own domain dropped 3+ positions. `triggerReason` explains which condition fired.

Also write a helper `loadLastTwoSnapshots(domain, keyword, runsDir)` that returns the last two dated snapshots on disk (or null if only one exists).

**`src/triggers/restrategy-trigger.ts`**
```ts
export async function maybeTriggerRestrategy(
  delta: SerpDelta,
  clientContext: ClientContext,
  runsDir: string,
): Promise<{ triggered: boolean; runId: string | null }>
```
If `delta.triggerRestrategy` is true, calls Layer 2's strategy agent with a `partialRerun: true` flag and the specific keyword. Layer 2 today runs on the full client context - for now, just import `runStrategyAgent` from `@rynk/layer2-strategy` and pass a stripped-down input focused on one keyword. If Layer 2's signature doesn't support partial re-runs yet, log a warning and return `{ triggered: false, runId: null }`. Don't try to modify Layer 2 - flag it for Asmin.

**`src/jobs/serp-watch.ts`**
```ts
export async function runSerpWatch(
  domain: string,
  clientContext: ClientContext,
  runsDir: string,
): Promise<{ deltas: SerpDelta[]; restrategiesTriggered: number }>
```
The orchestrator for the whole SERP watch loop. For each target keyword in `clientContext.targetKeywords`:
1. Take a fresh snapshot via `takeSerpSnapshot`.
2. Load previous snapshot (if exists).
3. Compute delta.
4. Persist the delta to `runs/{domain}/monitor/serp/{keyword-slug}/delta-{date}.json`.
5. Call `maybeTriggerRestrategy` on each delta.

Return the aggregated results.

Add plenty of `createLogger("layer5.serp-watch")` calls so we can see what happened when.

## 9. Person 2 - Owned-domain metrics + weekly digest

You own the **inside view**: our own performance metrics and the client-facing summary.

### Files you create

```
src/snapshots/gsc-snapshot.ts
src/snapshots/ga-snapshot.ts
src/snapshots/da-snapshot.ts
src/snapshots/backlinks-snapshot.ts
src/snapshots/rank-snapshot.ts
src/digest/weekly-digest.ts
src/jobs/metrics-watch.ts
```

### Files + functions in detail

**`src/snapshots/gsc-snapshot.ts`**
```ts
export async function takeGscSnapshot(
  domain: string,
  weekStarting: string, // ISO date, Monday of the week
  runsDir: string,
): Promise<GscSnapshot>
```
Calls the existing GSC client in `@rynk/core/clients/gsc`. Pulls impressions, clicks, avg position, and top queries for the week. Serialises to `GscSnapshotSchema`. Writes to `runs/{domain}/monitor/gsc/{date}.json`. Returns the snapshot.

**`src/snapshots/ga-snapshot.ts`**
Same shape but for GA. Sessions, conversions, top landing pages.

**`src/snapshots/da-snapshot.ts`**
Uses the `KeywordDataProvider` interface to pull current DA. If the provider returns null (no API access configured), write a snapshot with `da: null` and a warning log. Don't fail.

**`src/snapshots/backlinks-snapshot.ts`**
Two responsibilities:
1. Call the `KeywordDataProvider` for the current backlink list.
2. Diff against last week's snapshot to compute `newSinceLast` and `lostSinceLast`.
Persist the result. If no previous snapshot, `newSinceLast = []` and `lostSinceLast = []`.

**`src/snapshots/rank-snapshot.ts`**
```ts
export async function takeRankSnapshot(
  domain: string,
  keywords: string[],
  runsDir: string,
): Promise<RankSnapshot[]>
```
For each keyword, uses SerpAPI to find the position of `domain` in the top 100 results. Returns null rank if not in top 100. Writes one combined `RankSnapshot[]` array to `runs/{domain}/monitor/rank/{date}.json`.

**`src/digest/weekly-digest.ts`**
```ts
export async function buildWeeklyDigest(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<WeeklyDigest>
```
The big rollup. Reads:
- This week's + last week's snapshots for rank, GSC, GA, DA, backlinks.
- This week's SERP deltas (Person 1's output).

Produces the `WeeklyDigestSchema`:
- `rankGains` / `rankLosses`: keywords that moved by 3+ positions.
- `newCompetitors`: unique competitor domains that appeared in any SERP top 10 this week that weren't there last week.
- `gscTrend` / `gaTrend`: `up` / `down` / `flat` based on WoW percentage.
- `daChange`: numeric.
- `backlinkChange`: `+X new, -Y lost`.
- `actionsRecommended`: list of keywords that triggered Layer 2 re-strategy this week, plus any keywords the digest itself flags for manual review (e.g. rank dropped 10+ positions but no SERP-level cause).

Persist to `runs/{domain}/monitor/digest/{date}.json`. This is the file the dashboard will render.

**`src/jobs/metrics-watch.ts`**
```ts
export async function runMetricsWatch(
  domain: string,
  clientContext: ClientContext,
  runsDir: string,
): Promise<{ digest: WeeklyDigest }>
```
Runs in order:
1. Compute this week's Monday (`weekStarting`).
2. Call all six snapshot functions in parallel.
3. Call `buildWeeklyDigest`.
4. Return the digest.

## 10. How Person 1 + Person 2 tie together

Both jobs are wired together by a single top-level entry point that a dev (or a future cron) calls once per client per week.

Someone owns writing this file - do it together after both branches are merged. This is the last step, not the first:

**`src/index.ts`** (top-level, both of you review)
```ts
export async function runLayer5Monitor(
  domain: string,
  clientContext: ClientContext,
  runsDir: string,
): Promise<{
  deltas: SerpDelta[];
  restrategiesTriggered: number;
  digest: WeeklyDigest;
}> {
  // 1. Person 1's job runs first (produces SERP deltas + triggers re-strategy).
  const serpResults = await runSerpWatch(domain, clientContext, runsDir);

  // 2. Person 2's job runs second (reads the SERP deltas into the digest).
  const metricsResults = await runMetricsWatch(domain, clientContext, runsDir);

  return {
    deltas: serpResults.deltas,
    restrategiesTriggered: serpResults.restrategiesTriggered,
    digest: metricsResults.digest,
  };
}
```

Also export every schema from `src/schema/` and every snapshot function so Asmin can wire them individually later.

## 11. Coding conventions to match the rest of the codebase

- **TypeScript strict mode.** No `any`. If you truly need to escape, use `unknown` and narrow.
- **Zod for every artifact.** Never write a JSON file without validating the shape first. Look at how `layer1-audit` uses `.safeParse` before writing.
- **Named exports only.** No default exports anywhere.
- **`createLogger("layer5.<file>")` at the top of every file.** Use `.info` / `.warn` / `.error` freely. No `console.log`.
- **File paths always come from function arguments (`runsDir`), never hardcoded.** Look at `layer1-audit/src/index.ts` for the pattern.
- **Reuse `writeJson`, `readJson`, `ensureDir` from `@rynk/core/utils/files`.** Never call `fs.writeFile` directly.
- **No `--no-verify` on commits.** Hooks exist to catch issues, respect them.
- **Commit messages**: `feat(layer5): serp snapshot function` / `feat(layer5): weekly digest builder`. Match the style you see in `git log`.

## 12. What I'd be testing when both PRs are ready

1. Reviews each PR independently.
2. Merges them together into `layer5/integration`.
3. Adds the missing API keys to `.env` (SerpAPI paid tier, KeywordDataProvider credentials, GSC + GA OAuth).
4. Runs `runLayer5Monitor("itechdata.ai", ...)` locally against production APIs.
5. Verifies the outputs make sense.
6. Merges `layer5/integration` into `main`.
7. Later: wires it to a weekly cron and pipes the digest into the dashboard.

## 13. Definition of done for each person

**Person 1 done when:**
- Branch has all four files above with real implementations (no `TODO` stubs).
- Running `runSerpWatch("itechdata.ai", ctx, "./runs")` locally produces valid SERP snapshots + deltas on disk.
- Delta detection was tested against two hand-crafted snapshots (write a small script under `scripts/` or a Vitest file to prove it).
- The re-strategy trigger fires or doesn't fire correctly based on the conditions.
- PR opened with a description of what was built and any assumptions made.

**Person 2 done when:**
- All seven files above have real implementations.
- Running `runMetricsWatch("itechdata.ai", ctx, "./runs")` produces valid snapshots + a digest on disk.
- The digest correctly reads Person 1's SERP deltas when they exist and skips them cleanly when they don't.
- All snapshots write to the right paths matching section 7.
- PR opened with a description of what was built.

## 14. If you get stuck

1. Read the existing package (`layer1-audit`) for how the pattern works. Copy shamelessly.
2. Check `packages/core/src/clients/` for the client you need - it probably exists. 