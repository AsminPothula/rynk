# rynk.ai WordPress — Deployment Runbook

How the marketing site (rynk.ai) ships, and the gotchas that have bitten us so a
change "doesn't show up." Read this before/after any theme change.

> **Access constraint:** rynk.ai runs on the **company's** WordPress (WP Engine
> install `rynkai`). We only touch the **rynk theme** (`wp-content/themes/rynk-ai/`)
> and the **rynk pages** — never global WP/host settings, other themes, or plugins.

---

## The pipeline (what actually happens)

1. You edit files under `apps/wordpress/themes/rynk/**` and push to **`main`**.
2. GitHub Action **`.github/workflows/deploy-wordpress.yml`** fires — but **only**
   when the push touches `apps/wordpress/themes/rynk/**` (path filter). A change
   anywhere else does NOT deploy the site.
3. CI builds Tailwind: `apps/wordpress/themes/rynk/build` → `npm install && npm run build`
   → writes `../assets/css/theme.css` (minified).
4. CI deploys with `wpengine/github-action-wpe-site-deploy@v3`:
   - `WPE_ENV: rynkai`
   - `SRC_PATH: apps/wordpress/themes/rynk/`  (repo dir)
   - `REMOTE_PATH: wp-content/themes/rynk-ai/`  (**live active theme dir**)
5. Runs take ~1 min. Check status: `gh run list --workflow="Deploy WordPress Theme"`.

---

## Gotchas (each one has cost us a debugging session)

### 1. Repo theme dir ≠ live theme dir  ⚠️ the big one
The repo folder is `themes/rynk/`, but the **active theme on the install is
`themes/rynk-ai/`**. `REMOTE_PATH` MUST be `wp-content/themes/rynk-ai/`. If it
ever points at `rynk/`, the deploy "succeeds" but the live site never changes.

### 2. New/changed pages need a scaffold-version bump
Pages (`/pricing`, `/privacy-policy`, `/app`, …) are **created in code**, not the
WP editor — see `rynk_pages()` + `rynk_scaffold_pages()` in `functions.php`. The
scaffolder is guarded by `RYNK_SCAFFOLD_VERSION` and only re-runs when that
constant changes. **When you add or rename a page in `rynk_pages()`, bump
`RYNK_SCAFFOLD_VERSION`** or the page never gets created on the live site
(`after_switch_theme` doesn't fire on an already-active theme).

### 3. "Logged-in sees it, incognito 404s" = page not public / permalinks stale
Symptom we hit with the Privacy Policy: editors saw it, the public got a 404.
Causes: the page was a **draft**, and/or **pretty-permalink rewrite rules were
never flushed** after the page was created via `wp_insert_post()`.
Now self-healed in `rynk_scaffold_pages()`: it force-publishes scaffolded pages,
reassigns the template, and `rynk_maybe_scaffold_pages()` calls
`flush_rewrite_rules()` once per version bump. So the fix for this class of bug
is simply **bump `RYNK_SCAFFOLD_VERSION` and deploy**.

### 4. Caching — "I deployed but nothing changed" for logged-out users
WP Engine serves **logged-out** visitors a full-page cache and **bypasses it for
logged-in** users. So right after a deploy, you (logged in) see the change and
incognito doesn't. This is expected. Fix: in wp-admin top bar click **"Clear all
caches"** (WP Engine) — a rynk-scoped, safe action — then re-check in incognito.
Re-saving a page (Update) also auto-purges that URL. A browser hard-refresh does
**not** help; it's a server cache.

### 5. New Tailwind classes only work if they appear literally in PHP
The JIT scanner reads `../**/*.php` (see `build/tailwind.config.js` `content`).
Only class strings that exist as **literals** in a `.php` file get compiled.
Dynamically-assembled class names won't be included. CI rebuilds `theme.css` on
every deploy, so production always has the fresh CSS even if the committed
`theme.css` is stale — but a **local** preview needs `npm run build` in `build/`.

### 6. Favicon / head assets vs page-specific issues
Head output (favicon, meta) rides on every already-working page, so it can look
"deployed" while a specific page/URL is still broken. Don't let a working favicon
convince you a page-level problem (404, draft, cache) is fixed — test the exact
URL in incognito.

### 7. OPcache (historical red herring)
WP Engine PHP has `opcache.restrict_api` set, so you can't clear OPcache from
user space, and we once chased this for hours. The deploy replaces files and the
opcache picks them up; it has **not** been the real cause of a stuck change —
items 1–4 have. Rule out those first.

---

## Pre-deploy checklist

- [ ] Change is under `apps/wordpress/themes/rynk/**` (else it won't deploy).
- [ ] Added/renamed a page? Bumped `RYNK_SCAFFOLD_VERSION` in `functions.php`.
- [ ] Introduced new Tailwind classes? They're literal strings in `.php`.
- [ ] Merged to `main` (deploy only runs from `main`).

## Post-deploy verification

1. `gh run list --workflow="Deploy WordPress Theme"` → latest run is **success**.
2. Open the **exact URL in incognito** (not just logged in).
3. Still stale? wp-admin top bar → **Clear all caches** → re-check incognito.
4. A page 404s for the public but shows in wp-admin? Bump `RYNK_SCAFFOLD_VERSION`,
   redeploy (self-heals publish + template + permalink flush). Manual fallback:
   wp-admin → the page → confirm **Published** + Template set → **Update**, then
   **Settings → Permalinks → Save Changes**.
