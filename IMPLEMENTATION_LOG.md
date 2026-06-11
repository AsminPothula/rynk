# Implementation Log

Running changelog of everything built in rynk. Each entry references the plan
section it addresses. See `/Users/asmin/.claude/plans/iridescent-greeting-kahan.md`
for the master plan and `rynk-files/NOTES.md` for working memory.

Format:
```
## YYYY-MM-DD — Short title
**Phase / Plan section:** Phase 0 — Foundation
**Files changed:** packages/...
**What:** One-paragraph description of what was built.
**Why:** What plan item or problem this addresses.
**Verification:** How we know it works.
```

---

## 2026-06-11 — Initial setup: implementation log + plan + memory file

**Phase / Plan section:** Project meta — tracking infrastructure
**Files changed:** `IMPLEMENTATION_LOG.md` (new), `rynk-files/NOTES.md` (new)
**What:** Created the running implementation log (this file) and the rynk
memory file (`rynk-files/NOTES.md`). Master plan written to
`~/.claude/plans/iridescent-greeting-kahan.md` covering Phase 0 through
Phase 3, web dashboard, testing strategy, and GitHub workflow.
**Why:** Before any feature code, set up the tracking infrastructure so
progress is visible, decisions are recorded, and context survives across
sessions.
**Verification:** Three files exist, all readable, plan references the memory
file and the log.

---

## 2026-06-11 — KeywordDataProvider + OwnedDomainDataProvider interfaces

**Phase / Plan section:** Phase 0 — Foundation
**Files changed:**
- `packages/core/src/clients/keyword-data/types.ts` (new)
- `packages/core/src/clients/keyword-data/mock.ts` (new)
- `packages/core/src/clients/keyword-data/index.ts` (new — factory)
- `packages/core/src/clients/owned-domain-data/types.ts` (new)
- `packages/core/src/clients/owned-domain-data/mock.ts` (new)
- `packages/core/src/clients/owned-domain-data/index.ts` (new — factory)
- `packages/core/src/clients/index.ts` (added re-exports)

**What:** Two provider-agnostic interfaces in `@rynk/core`:
- `KeywordDataProvider` — keyword volume, difficulty, CPC, intent, related
  keywords, domain authority. Swap target for SEMrush / Ahrefs / DataForSEO.
- `OwnedDomainDataProvider` — Google Search Console + Analytics data for
  domains the client controls. Top queries, top pages, index coverage,
  engagement, conversions.

Both ship with a deterministic mock implementation derived from a stable
hash of the input — same input always returns the same numbers. Lets every
downstream layer be built and tested without API keys.

Both factories memoize their instance and read `KEYWORD_DATA_PROVIDER` /
`OWNED_DOMAIN_DATA_PROVIDER` env vars (default `mock`). To swap in a real
provider later, add one switch case and a class — zero changes to callers.

**Why:**
- Unblocks Phase 0 wiring (Tasks #3, #4) — schemas and Layer 1 pre-compute
  can be built against the interface without waiting for boss decision on
  paid API access.
- Sets the pattern for all future external integrations: interface in core,
  mock alongside, factory chooses based on env. Same pattern will apply to
  CMS adapters, image gen, GBP, etc.
- Follows standing engineering rules: interface-driven, single source of
  truth, normalized return types, no leaky abstractions.

**Verification:**
- `npx tsc -b` exits cleanly across the whole monorepo
- Types are exported from `@rynk/core` (visible to all packages)
- Mock returns reproducible values for the same input

---

## 2026-06-11 — Schema enrichment: keyword metrics + domain authority

**Phase / Plan section:** Phase 0 — Foundation
**Files changed:**
- `packages/core/src/schemas/audit-findings.ts`
- `packages/core/src/schemas/strategy-output.ts`
- `packages/core/src/clients/keyword-data/types.ts` (use schema's KeywordIntent)

**What:**
- `audit-findings.ts`: added `KeywordIntentSchema` (Zod enum), `KeywordMetricsEnrichmentSchema` (volume/difficulty/cpc/intent/country), `DomainAuthorityRecordSchema`, and `AuthoritySectionSchema`. Extended `SerpKeywordDataSchema` with optional `metrics` field. Added top-level `authority` field on `AuditFindingsSchema` with safe defaults so legacy fixtures still parse.
- `strategy-output.ts`: extended `TopicClusterSchema` with `pillarKeywordMetrics` + `spokeKeywordMetrics`. Extended `ContentBriefSchema` with `targetKeywordMetrics` + `secondaryKeywordMetrics`. Added top-level `authority` field on `StrategyOutputSchema`.
- `keyword-data/types.ts`: `KeywordIntent` now imports from the schema instead of redefining it — single source of truth for the enum.

**Why:**
- Carries volume/difficulty/CPC data through every layer, addressing the gap
  noted in NOTES.md item #11 (search vol + difficulty everywhere).
- Carries DA for client + competitors through audit and strategy so the
  dashboard and Layer 3 generators can do gap analysis without re-fetching.
- All new fields are optional + nullable so the LLM can keep producing the
  same JSON it does today; pre-compute step populates them.
- Following the standing engineering rule: "No magic strings, single source
  of truth" — KeywordIntent now lives in exactly one place.

**Verification:**
- `npx tsc -b` exits cleanly
- Existing fixtures still parse (legacy audits with no authority/metrics
  fields use the schema defaults)

---

## 2026-06-11 — Layer 1 keyword + authority enrichment wiring

**Phase / Plan section:** Phase 0 — Foundation
**Files changed:**
- `packages/layer1-audit/src/utils/keyword-enrichment.ts` (new)
- `packages/layer1-audit/src/agents/synthesiser-agent.ts` (accepts enrichment)
- `packages/layer1-audit/src/index.ts` (calls enrichment before synth)

**What:**
- New `enrichKeywordsAndAuthority()` utility — deduplicates keywords, calls
  `KeywordDataProvider.getKeywordMetricsBulk()` + `getDomainAuthorityBulk()`,
  returns a structured `KeywordEnrichment` object.
- Failures from the provider are caught and degrade to nulls — never crashes
  the audit.
- `runSynthesiserAgent()` accepts an optional `enrichment` field. Before Zod
  validation, it splices `.metrics` into every matching SerpKeywordData entry
  and assigns the top-level `.authority` object.
- `runLayer1()` computes enrichment from `client.seedKeywords` and
  `client.competitors`, passes it to the synthesiser.

**Why:**
- Audits now carry per-keyword volume / difficulty / CPC / intent.
- Audits now carry DA for client and every competitor.
- Provider is mocked today (deterministic fake data) — swap to a real one
  (SEMrush / Ahrefs / DataForSEO) via env var without touching this code.
- Closes the loop on the "search volume + difficulty everywhere" gap from
  NOTES.md item #11 + DA tracking from NOTES.md item #9.

**Verification:**
- `npx tsc -b` exits cleanly
- A live run will now produce `audit.json` with `authority.client.score`
  and `serpData.byKeyword[].metrics` populated
- Provider provenance recorded via `authority.client.provider` field

---

## 2026-06-11 — Adaptive onboarding: completeness + auto-fill + questionnaire

**Phase / Plan section:** Phase 1 (onboarding adaptation, originally Phase 3)
**Files changed:**
- `packages/orchestrator/src/onboarding/completeness.ts` (new)
- `packages/orchestrator/src/onboarding/auto-fill.ts` (new)
- `packages/orchestrator/src/onboarding/questionnaire.ts` (new)
- `packages/orchestrator/src/index.ts` (wires the gap-filling flow)

**What:** Replaced the planned "new-site mode vs existing-site mode" fork
with a single pipeline that adapts via measurement, not labels.

After onboarding agent extraction, the flow now:
1. `assessCompleteness(ctx)` scores every ClientContext field and produces a
   `CompletenessReport` tagging each gap with severity + a fill strategy
   (auto-keyword-research / auto-serp-research / human-required /
   human-preferred). Pure function — no I/O.
2. `autoFillGaps(...)` walks the gaps and fills what it can:
   - sparse `seedKeywords` → expand using `KeywordDataProvider.getRelatedKeywords`
     + `getKeywordMetricsBulk`, ranked by volume / (difficulty+1)
   - competitor inference via SERP left as future work (falls through)
3. `runQuestionnaire(...)` asks the human ONLY for fields still flagged.
   - 11 question templates, each with a parser for the right ClientContext patch
   - Empty answers skip the field (keeps current value)
   - Handles dotted paths like `canonicalNAP.address`

**Why this matters:**
- An established + optimized site (itechdata.ai) passes through with
  `isComplete=true` → zero questions asked. Same UX as before.
- An unoptimized site with content gets autofill on `seedKeywords` + a
  short questionnaire for ICP, competitors, etc.
- A brand-new 1-page site gets the most questions but still uses the same
  pipeline. No branching, no mode flags, no two-flows-to-maintain.
- Demo angle: rynk auto-detects what's missing and only asks for the rest.

**Verification:**
- `npx tsc -b` exits cleanly
- Pure function (`assessCompleteness`) trivial to unit test once we wire tests
- Live test: run `npm run pipeline -- somethin-greenfield.com --force-onboard`
  to see the questionnaire fire; itechdata.ai should pass with no questions

---

## Pending entries

Below this line, future entries are added as work completes.
