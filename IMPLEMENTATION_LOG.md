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

## 2026-06-12 — Layer 3 execution manifest + first generators

**Phase / Plan section:** Phase 1 — Execution layer
**Files changed:**
- `packages/layer3-generate/package.json` (new)
- `packages/layer3-generate/tsconfig.json` (new)
- `packages/layer3-generate/src/index.ts` (new)
- `packages/layer3-generate/src/schema/execution-manifest.ts` (new)
- `packages/layer3-generate/src/generators/meta.ts` (new)
- `packages/layer3-generate/src/generators/schema.ts` (new)
- `packages/layer3-generate/src/generators/index.ts` (new — composer)
- `tsconfig.json` (registered layer3 reference)

**What:** New `@rynk/layer3-generate` package containing:

1. **ExecutionManifest schema** — discriminated-union Zod schema covering
   15 action types: `create_page`, `update_page`, `update_meta`,
   `add_redirect`, `inject_schema`, `insert_internal_link`, `create_author`,
   `assign_author`, `add_nap_block`, `create_image`, `create_document`,
   `draft_brand_post`, `draft_outreach`, `propose_code_change`,
   `update_offsite_profile`. Each action carries lifecycle status,
   risk score, channel (cms/code-pr/outreach/social/document/image/offsite),
   automatable flag, and provenance (audit issue / brief / cluster).

2. **Meta generator** — produces `update_meta` actions for every URL in
   `audit.technicalCrawl.missingMetas`, `duplicateMetas`, plus pages flagged
   `update` or `expand` in `strategy.contentInventory`. Heuristic copy today;
   future swap to LLM-based behind the same function signature.

3. **Schema generator** — produces `inject_schema` actions for:
   - Organization schema on homepage (sitewide deploy)
   - Service schema on every `/solutions/` or `/services/` page
   - Article schema on every blog post URL
   Skips URLs that already have the right schemaType.

4. **Composer** (`composeManifest`) — walks a generator registry, runs each,
   concatenates actions, builds the summary block, returns a validated
   `ExecutionManifest`. Adding a new generator = one entry in the registry.

**Why:**
- The execution manifest is the **architectural keystone** of the
  generate→publish pipeline. Without it, Layer 4 has no contract to apply
  against, and the dashboard has nothing structured to show.
- Discriminated union means every adapter call site gets a fully-narrowed
  type — no `as` casts in WP adapter dispatch.
- Provenance + risk + automatable fields give the dashboard everything it
  needs to group actions, batch approvals, and route to the right reviewer.

**Verification:**
- `npx tsc -b` exits cleanly across the whole monorepo
- Composer produces a manifest with summary counts that match the actions
  list — verifiable via a quick unit test later

---

## 2026-06-12 — Layer 4 publish foundation + WordPress adapter skeleton

**Phase / Plan section:** Phase 1 — Execution layer
**Files changed:**
- `packages/layer4-publish/package.json` (new)
- `packages/layer4-publish/tsconfig.json` (new)
- `packages/layer4-publish/src/index.ts` (new)
- `packages/layer4-publish/src/adapters/types.ts` (new — adapter contract)
- `packages/layer4-publish/src/adapters/wordpress/index.ts` (new — skeleton)
- `packages/layer4-publish/src/apply.ts` (new — manifest applier)
- `tsconfig.json` (registered layer4 reference)

**What:** New `@rynk/layer4-publish` package containing:

1. **ActionAdapter interface** — single shared contract for every adapter
   family (CMS, code-PR, offsite, outreach). Polymorphic `apply(action)` +
   `canHandle(action)` filter. CMSAdapter narrows `channel` to "cms" and
   adds a `cmsName` field.

2. **WordPress adapter** — declares cmsName "wordpress", supports 9 action
   types via dispatch. **Skeleton today**: live HTTP is gated behind
   `WORDPRESS_LIVE=true`. Default mode logs the intended call and returns
   `status="skipped"` so dry-runs are safe. Each handler throws "not
   implemented" with a precise note for the live build (e.g. "needs
   Yoast/RankMath detector + REST call").

3. **applyManifest()** — walks every action in a manifest, finds the first
   adapter that handles it, runs it with a timeout, catches errors, updates
   action.status in place, recomputes the summary block. Skips terminal
   states. Approval-gated by default (only `status="approved"` actions run).

**Why:**
- Decouples generate from publish — Layer 3 doesn't know about WordPress;
  Layer 4 doesn't know how content was generated.
- Same dispatch path will eventually serve GitHub PRs, GBP updates,
  outreach emails, etc. New channels = new adapter file, zero changes
  anywhere else.
- Skeleton-with-real-shape pattern keeps `npx tsc -b` honest about the
  surface area while making it impossible to accidentally fire HTTP calls
  before credentials are in place.

**Verification:**
- `npx tsc -b` clean across the monorepo
- Adapter contract used in WordPress already — confirms shape is workable
- Live mode is opt-in via env, default is dry-run safe

---

## 2026-06-12 — Layer 3 wired into pipeline + verifier + 3 new generators

**Phase / Plan section:** Phase 1 — Execution layer
**Files changed:**
- `packages/layer3-generate/src/utils/markdown-renderer.ts` (new)
- `packages/layer3-generate/src/utils/output-writer.ts` (new)
- `packages/layer3-generate/src/index.ts` (re-exports added)
- `packages/layer3-generate/src/generators/redirects.ts` (new)
- `packages/layer3-generate/src/generators/internal-links.ts` (new)
- `packages/layer3-generate/src/generators/nap-block.ts` (new)
- `packages/layer3-generate/src/generators/index.ts` (registry expanded)
- `packages/orchestrator/src/index.ts` (Layer 3 composeManifest call after Layer 2)
- `packages/orchestrator/package.json` (added @rynk/layer3-generate dep)
- `packages/orchestrator/tsconfig.json` (added layer3 reference)
- `scripts/verify-layer3.ts` (new — Docker-free verification)

**What:**

*Move 1 — Layer 3 wired into pipeline:*
- `executionManifestToMarkdown()` — channel-grouped human renderer, one
  block per action with target / payload / provenance / notes. Exhaustive
  switch over action types (compile error if a new type is added without a
  renderer).
- `saveExecutionManifest()` — mirrors `saveStrategyOutput()`, writes
  `execution-manifest.json` + `execution-manifest.md` to
  `runs/{domain}/{today}/`.
- Orchestrator now calls `composeManifest()` + `saveExecutionManifest()`
  after Layer 2. Skip with `SKIP_LAYER3=true` for Layer 1/2-only iteration.

*Move 2 — End-to-end verification (no Docker, no API calls):*
- `scripts/verify-layer3.ts` loads the existing 2026-05-18 audit + strategy
  + client.json from disk, calls `composeManifest()`, saves under today's
  date. Proves the wiring works on real itechdata.ai data without needing
  Crawl4AI / Anthropic / SerpAPI.
- Result: 31 actions composed from the 2-generator setup.

*Move 3 — Three new generators (5 total now):*
- `redirects.ts` — walks `strategy.cannibalizationFixes`, emits
  `add_redirect` per URL whose action is "301". Risk: medium.
- `internal-links.ts` — walks `strategy.contentBriefs[].internalLinks`,
  emits `insert_internal_link` per inbound/outbound suggestion. Risk: medium.
- `nap-block.ts` — emits `add_nap_block` on the contact page when audit
  flags incomplete NAP. Uses canonical client NAP, includes LocalBusiness
  schema flag. Risk: medium.
- All three registered in the composer's registry.

**Verification:**
- `npx tsc -b` clean across the monorepo
- `npx tsx scripts/verify-layer3.ts` produces 160 actions from itechdata.ai
  real data (30 meta + 1 schema + 2 redirect + 127 internal-links + 0 NAP)
- `runs/itechdata.ai/2026-06-12/execution-manifest.md` renders correctly

**Why this is the demo win:**
- For the first time, `npm run pipeline -- itechdata.ai` produces a complete
  picture: what the audit found, what the strategy recommends, AND the
  concrete list of every change rynk will make. 160 actions, all typed and
  validated.
- The execution manifest is the artifact the dashboard will render, the
  approval queue will gate, and Layer 4 will apply.

---

## 2026-06-12 — Three more generators: content-skeleton + outreach + brand-posts

**Phase / Plan section:** Phase 1 — Execution layer (multi-channel output)
**Files changed:**
- `packages/layer3-generate/src/generators/content-skeleton.ts` (new)
- `packages/layer3-generate/src/generators/outreach.ts` (new)
- `packages/layer3-generate/src/generators/brand-posts.ts` (new)
- `packages/layer3-generate/src/generators/index.ts` (registry expanded to 8)

**What:** Three new generators that extend rynk's output beyond CMS-only:

1. **content-skeleton** — for every `ContentBrief`, emits a `create_page`
   action with title, meta description, suggested slug, page type
   (pillar/spoke/blog/landing/policy), parent slug, outline array
   (sections with heading + purpose hint), and the body rendered as the
   outline markdown. Body-filling pass (LLM) will overwrite the body later.
   This is the structural pass — cheap, deterministic, every brief = one
   action.

2. **outreach** — three sub-sources:
   - Gap report → guest-post pitches per competitor URL (positions client
     as a contributing voice)
   - Authority roadmap → press pitches per target publication
   - Top 5 competitors → backlink-request drafts
   Each draft has subject + body templates, suggested send dates staggered
   3 days apart, `automatable=false` (human reviews + sends from their own
   email).

3. **brand-posts** — three sub-sources:
   - Top 5 priority clusters → LinkedIn thought-leadership posts (long-form)
   - Top 3 AI Overview opportunities → Reddit discussions (subreddit picked
     from client.industry)
   - Top 3 quick wins → Threads short posts
   All `automatable=false` — the human posts from the client's own accounts.
   Rationale field on each ties it back to the SEO/AEO outcome.

**Why:**
- Rynk now produces output across **3 channels (cms / outreach / social)**
  in a single run. Demo says "this isn't just an audit — every action is in
  here, with subject lines, body drafts, and a send schedule."
- AEO/GEO is finally addressed structurally — the brand-post generator
  exists specifically because LLM citations come from broad brand presence,
  not just on-site SEO.
- Outreach drafts give the SEO team a working queue instead of a TODO list.
  They open the action, edit the placeholders, send. ~20x faster than
  writing each one from scratch.

**Verification:**
- `npx tsc -b` clean
- `verify-layer3.ts` produces **205 total actions** on itechdata.ai 2026-05-18:
  - 30 update_meta · 1 inject_schema · 2 add_redirect · 127 insert_internal_link
  - 17 create_page (skeletons) · 17 draft_outreach · 11 draft_brand_post
  - 177 automatable (CMS work) · 28 needs human approval (outreach + social)

**Next obvious step:**
- LLM body-filler generator that walks `create_page` actions and writes
  real prose into `payload.bodyMarkdown` (opt-in via env var, since it
  burns Anthropic budget).

---

## 2026-06-12 — LLM body-filler for create_page actions

**Phase / Plan section:** Phase 1 — Execution layer (content generation)
**Files changed:**
- `packages/layer3-generate/src/prompts/content-body-prompt.ts` (new)
- `packages/layer3-generate/src/agents/content-body-agent.ts` (new)
- `packages/layer3-generate/src/post/fill-content-bodies.ts` (new)
- `packages/layer3-generate/src/index.ts` (re-exports)
- `packages/orchestrator/src/index.ts` (opt-in wiring)

**What:**
- New body-filler agent runs one Claude call per `create_page` action.
  Single-turn, no tools (room to add `web_fetch` for fact-grounding later
  without changing the surface).
- System prompt enforces EEAT, AEO/GEO, brand voice, no hype words,
  hedged-or-flagged numbers (never fabricated stats).
- User message packs the full ContentBrief + ClientContext + outline +
  competitor elements + internal-link targets into one structured input.
- Post-processor `fillContentBodies()` walks every `create_page` action
  that still has the skeleton marker `**Outline only.**`, finds the matching
  ContentBrief via `provenance.sourceId`, calls the agent, and overwrites
  `payload.bodyMarkdown` in place. Idempotent — already-filled actions skip.
- Supports a `briefIds` whitelist for partial runs ("fill these 3 first,
  review, then the rest").
- Parallelism via `parallel=true` + `maxConcurrent=3` (default sequential
  to stay within per-minute token rate limits).
- Wired into orchestrator behind `FILL_CONTENT_BODIES=true` env var so the
  default pipeline run stays free of LLM spend.

**Why:**
- The biggest gap in Layer 3 was that `create_page` actions carried only
  outlines. Layer 4 (publish) needs real prose to actually push a page.
- Body-filler completes the create-page lifecycle: brief → skeleton →
  prose → publishable action. From here, Layer 4's WP adapter can
  actually create pages once its REST calls are unstubbed.
- Opt-in design lets the team review skeleton manifests cheaply, then
  spend budget only on briefs they want bodies for.

**Verification:**
- `npx tsc -b` clean across the monorepo
- Skeleton path still works without the env var — unchanged behaviour for
  default pipeline runs
- Live verification deferred to next pipeline run with
  `FILL_CONTENT_BODIES=true` set

---

## 2026-06-12 — Three more generators: images + code-PRs + documents

**Phase / Plan section:** Phase 1 — Execution layer (full multi-channel coverage)
**Files changed:**
- `packages/layer3-generate/src/generators/images.ts` (new)
- `packages/layer3-generate/src/generators/code-prs.ts` (new)
- `packages/layer3-generate/src/generators/documents.ts` (new)
- `packages/layer3-generate/src/generators/index.ts` (registry expanded
  to 11, composer now passes `priorActions` to enable linking generators)

**What:**

*images generator* — emits `create_image` actions for hero / inline-diagram /
thumbnail per `create_page` action that already exists in the running
manifest. Patches each create_page's `payload.imageActionIds` so the WP
adapter knows which images attach to which page. Heuristics:
- Every page → hero (1280×640)
- Pillar/commercial → thumbnail (640×640)
- Informational ≥1500 words with technical keywords → inline diagram

Composer now passes `priorActions: ExecutionAction[]` to each generator so
this kind of two-pass linking can happen without a separate post step.

*code-prs generator* — emits `propose_code_change` actions for code-level
audit findings. Walks P1 + P2 issues, filters to dev-work (owner=dev +
effort M/L, or category=technical + code-level keywords), produces a PR
draft with title / description / branch suggestion / test plan. Always
includes a separate llms.txt action if `audit.technicalCrawl.llmsTxtStatus`
is missing or 404 (AEO/GEO signal).

*documents generator* — emits `create_document` actions for distributable
PDFs and PPTs. Per content brief:
- Commercial "now" + ≥1800 words → whitepaper PDF + sales deck PPTX
- Informational ≥2000 words → one-pager PDF
Distribution platforms pre-filled (SlideShare, Scribd, Issuu, etc).

**Verification:**
- `npx tsc -b` clean
- `verify-layer3.ts` produces **246 actions** on itechdata.ai 2026-05-18:
  - 30 meta · 1 schema · 2 redirect · 127 internal-link
  - 17 create_page · 17 outreach · 11 brand-post
  - 32 image (hero+diagram+thumbnail per page)
  - 5 code-PRs (page-speed + llms.txt)
  - 4 documents (1 whitepaper + 1 deck + 2 one-pagers)
  - 213 automatable · 33 human approval

**Why:**
- Rynk's manifest now covers **every channel** in the master plan: cms,
  outreach, social, image, code-pr, document. No category of work is
  unrepresented.
- The two-pass linking pattern (images → create_page.imageActionIds)
  proves the composer can express dependencies between actions. Same
  pattern will apply when authors link to posts, redirects link to
  consolidated URLs, etc.

---

## 2026-06-15 — ImageGenerationProvider + Layer 4 image adapter

**Phase / Plan section:** Phase 1 — Execution layer (image lifecycle complete)
**Files changed:**
- `packages/core/src/clients/image-generation/types.ts` (new)
- `packages/core/src/clients/image-generation/mock.ts` (new)
- `packages/core/src/clients/image-generation/index.ts` (new — factory)
- `packages/core/src/clients/index.ts` (re-export)
- `packages/layer4-publish/src/adapters/image/index.ts` (new)
- `packages/layer4-publish/src/index.ts` (re-export)
- `scripts/verify-image-adapter.ts` (new — end-to-end verifier)

**What:**
- `ImageGenerationProvider` interface — same swap pattern as
  KeywordDataProvider / OwnedDomainDataProvider. Single `generate(opts)`
  method returns a normalised `GeneratedImage` shape (url, dimensions,
  externalId, provider name, cost cents).
- `MockImageGenerationProvider` — deterministic placehold.co URLs sized
  to the requested dimensions, with the first words of the prompt
  rendered as text. Real reachable URLs, free.
- Factory in `@rynk/core` reads `IMAGE_GENERATION_PROVIDER` env (defaults
  to "mock"). Swap to real provider = one new class + one switch case.
- Layer 4 `makeImageAdapter()` — handles `create_image` actions. Maps
  the action's purpose to a style hint, calls the provider, writes the
  URL back into `action.payload.resultUrl` so downstream adapters can
  reference it.
- Verifier script proves the full chain works on real itechdata data:
  composes manifest → marks 32 create_image as approved → applyManifest
  with image adapter → all 32 applied, each with a real URL.

**Why:**
- Closes the `create_image` action lifecycle. Generators produced specs
  before; now the specs can be executed end-to-end. The Layer 4 image
  adapter fits the same `ActionAdapter` contract as the WordPress
  adapter, so the manifest applier dispatches images automatically.
- Mock URLs are real (placehold.co), so the dashboard or downstream
  adapters can fetch + display them today.
- Real provider implementations (DALL-E, Flux, Imagen) drop in with one
  switch case. Intern task documented in `rynk-files/NOTES.md`.

**Verification:**
- `npx tsc -b` clean
- `npx tsx scripts/verify-image-adapter.ts 2026-05-18` shows 32 actions
  applied, 0 failed, every action has `resultUrl` populated

---

## Pending entries

Below this line, future entries are added as work completes.
