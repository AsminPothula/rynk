/**
 * CachePurger - coordinates cache invalidation after a content change.
 *
 * When rynk updates a page, the change reaches the WP database instantly
 * but doesn't necessarily appear on the live site until every layer of
 * caching (WP plugin cache + CDN / Cloudflare) expires. That gap is
 * why clients sometimes see "rynk said applied but nothing changed."
 *
 * This service handles the purging in one call so handlers don't repeat
 * the logic. Two sources supported today:
 *
 *   1. WordPress caching plugins - WP Rocket, W3 Total Cache, LiteSpeed
 *      Cache, WP Super Cache. Each has its own REST endpoint that we
 *      hit if the plugin is detected as active on the client's site.
 *
 *   2. Cloudflare - if the client provides an API token + zone ID, we
 *      hit Cloudflare's REST API to purge the specific URLs (or the
 *      whole zone when we're passed no URLs).
 *
 * Best-effort: any failed purge is logged into the PurgeReport but the
 * caller decides how to surface it. Nothing thrown - a broken cache
 * purge should never fail an otherwise-successful content apply.
 */

import { createLogger } from "@rynk/core";
import type { WordPressClient } from "../adapters/wordpress/client.js";

const log = createLogger("layer4.cache-purger");

export type WPCachePlugin =
  | "wp-rocket"
  | "w3-total-cache"
  | "litespeed"
  | "wp-super-cache";

export interface CloudflarePurgeConfig {
  /** Cloudflare API token with Zone.Cache Purge permission. */
  apiToken: string;
  /** Cloudflare zone ID for the client's domain. */
  zoneId: string;
}

export interface CachePurgerConfig {
  /** WP client used to detect + call plugin purge endpoints. */
  wpClient?: WordPressClient;
  /** Cloudflare credentials for CDN-level purge. Omit when not used. */
  cloudflare?: CloudflarePurgeConfig;
  /**
   * Cached detection result. Skip the /wp/v2/plugins probe when set.
   * Useful when the caller has already detected once during onboarding.
   */
  detectedPlugins?: WPCachePlugin[];
}

/** Per-cache attempt result. */
export interface PurgeAttempt {
  cache: string;
  success: boolean;
  error?: string;
}

export interface PurgeReport {
  /** Every cache we attempted to purge. */
  attempts: PurgeAttempt[];
  /** True when every attempt succeeded (also true when no attempts were made). */
  allSucceeded: boolean;
  /** Short human-readable summary suitable for the ApplyResult message. */
  summary: string;
}

export class CachePurger {
  constructor(private readonly config: CachePurgerConfig) {}

  /**
   * Purge the given URLs across every configured cache. If no URLs are
   * provided, purges the entire cache (WP plugins) or the whole zone
   * (Cloudflare). Never throws.
   */
  async purge(urls: string[] = []): Promise<PurgeReport> {
    const attempts: PurgeAttempt[] = [];

    // WP-plugin purges (only when we have a WP client)
    if (this.config.wpClient) {
      const plugins = this.config.detectedPlugins
        ?? (await this.config.wpClient.detectCachingPlugins());
      for (const plugin of plugins) {
        attempts.push(await this.purgeWpPlugin(plugin, urls));
      }
    }

    // Cloudflare purge (only when we have creds)
    if (this.config.cloudflare) {
      attempts.push(await this.purgeCloudflare(this.config.cloudflare, urls));
    }

    const allSucceeded = attempts.every((a) => a.success);
    const summary = buildSummary(attempts);
    return { attempts, allSucceeded, summary };
  }

  // ─────────────────────────────────────────────────────────────────────

  private async purgeWpPlugin(plugin: WPCachePlugin, urls: string[]): Promise<PurgeAttempt> {
    const client = this.config.wpClient;
    if (!client) return { cache: plugin, success: false, error: "no wp client" };

    // Each plugin exposes its own REST endpoint. If the endpoint isn't
    // available (404), most likely the plugin doesn't expose one on the
    // current tier (WP Rocket free tier for example) - log as failure
    // rather than throw.
    try {
      switch (plugin) {
        case "wp-rocket":
          // POST /wp/v2/wp-rocket/v1/cache/purge (Pro API). Free tier
          // may need a WP-CLI trigger instead - fail gracefully here.
          await client.request("POST", "/wp-rocket/v1/purge", { urls });
          break;
        case "w3-total-cache":
          // W3TC needs the "REST API" addon plugin. Path varies; the
          // common one is /w3tc/v1/flush.
          await client.request("POST", "/w3tc/v1/flush", { urls });
          break;
        case "litespeed":
          // LiteSpeed Cache exposes its own REST at /litespeed/v1.
          await client.request("POST", "/litespeed/v1/purge", { urls });
          break;
        case "wp-super-cache":
          // Super Cache doesn't have a public REST endpoint. Attempt
          // its admin AJAX; if the site blocks it, this fails cleanly.
          await client.request("POST", "/wp-super-cache/v1/purge", { urls });
          break;
      }
      log.info("cache purged", { plugin, urlCount: urls.length });
      return { cache: plugin, success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.warn("cache purge failed", { plugin, error: msg });
      return { cache: plugin, success: false, error: msg };
    }
  }

  private async purgeCloudflare(
    cf: CloudflarePurgeConfig,
    urls: string[],
  ): Promise<PurgeAttempt> {
    const url = `https://api.cloudflare.com/client/v4/zones/${cf.zoneId}/purge_cache`;
    const body = urls.length > 0 ? { files: urls } : { purge_everything: true };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cf.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => "");
        return {
          cache: "cloudflare",
          success: false,
          error: `HTTP ${res.status}: ${bodyText.slice(0, 200)}`,
        };
      }
      log.info("cloudflare cache purged", { zoneId: cf.zoneId, urlCount: urls.length });
      return { cache: "cloudflare", success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.warn("cloudflare purge failed", { zoneId: cf.zoneId, error: msg });
      return { cache: "cloudflare", success: false, error: msg };
    }
  }
}

function buildSummary(attempts: PurgeAttempt[]): string {
  if (attempts.length === 0) return "no caches to purge";
  const succeeded = attempts.filter((a) => a.success).map((a) => a.cache);
  const failed = attempts.filter((a) => !a.success);
  if (failed.length === 0) return `purged ${succeeded.join(", ")}`;
  if (succeeded.length === 0) return `purge failed on ${failed.map((f) => f.cache).join(", ")}`;
  return `purged ${succeeded.join(", ")}; failed on ${failed.map((f) => f.cache).join(", ")}`;
}
