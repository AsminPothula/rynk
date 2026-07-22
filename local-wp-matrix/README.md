# local-wp-matrix

Multiple pre-configured local WordPress installations that rynk's Layer 4
adapter can be tested against. Each config runs on its own port so they
can be brought up in parallel.

Configs shipped:

| Config | Port | Plugins | Notes |
|---|---|---|---|
| baseline | 8080 | none | Plain permalinks. Regression baseline. |
| yoast | 8081 | Yoast SEO | Pretty permalinks. Exercises Yoast meta field routing. |
| rank-math | 8083 | Rank Math SEO | Pretty permalinks. Exercises Rank Math meta field routing. |
| seopress | 8084 | SEOPress | Pretty permalinks. Exercises SEOPress meta field routing. |
| elementor | 8082 | Elementor + Yoast | Pretty permalinks. Seeds an Elementor-managed page for the skip guard. |
| divi | 8085 | Yoast + simulated Divi page | Pretty permalinks. Divi is paid, so we simulate `_et_pb_use_builder = on`. |
| redirection | 8086 | Yoast + Redirection plugin | Pretty permalinks. Exercises `applyAddRedirect` once merged. |
| litespeed | 8087 | Yoast + LiteSpeed Cache | Pretty permalinks. Exercises the cache-purge detection + attempt. |
| woocommerce | 8088 | Yoast + WooCommerce | Pretty permalinks. Seeds a WooCommerce product to see how rynk copes with custom post types. |

## Bring one config up

```bash
cd local-wp-matrix/baseline
docker compose up -d
```

The init container installs WordPress, activates the plugins, sets
permalinks, and creates a rynk-matrix Application Password. Credentials
land at `local-wp-matrix/baseline/.secrets/config.json` when init
completes. That file is gitignored.

Wait ~30-60 seconds for the init to finish (the WP image bootstraps
its files, then WP-CLI configures the site). You can watch progress:

```bash
docker compose logs -f init
```

When you see `matrix config ready`, the site is provisioned.

## Bring one config down

```bash
cd local-wp-matrix/baseline
docker compose down -v   # -v also wipes the DB so next up is fresh
```

## Run the matrix verifier

From the repo root:

```bash
npx tsx scripts/verify-matrix.ts
```

The runner reads each config's `.secrets/config.json`, runs the same test
battery of Layer 4 handlers against every config, and prints a matrix
report showing which (config, handler) cells pass, skip, or fail.

If a config isn't running or its credentials haven't been generated yet,
the runner skips it with a warning.

## How the init container works

Each config's `docker-compose.yml` includes a one-shot `init` service
built on the `wordpress:cli` image. It:

1. Waits for the WordPress container to finish bootstrapping wp files
2. Waits for the MySQL container to accept connections
3. Runs `wp core install --url=... --admin_user=admin --admin_password=admin`
4. Installs and activates any plugins the config needs
5. Sets pretty permalinks (except on the baseline)
6. Creates a rynk-matrix Application Password (or replaces the existing one)
7. Writes `{ url, user, appPassword, testPage }` to `/rynk-secrets/config.json`
   which is bind-mounted at `.secrets/config.json` on the host

Every step is idempotent - re-running `docker compose up` doesn't
duplicate anything.
