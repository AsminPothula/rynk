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

## Pending entries

Below this line, future entries are added as work completes.
