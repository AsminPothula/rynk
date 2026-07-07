/**
 * Tiny WP REST API client.
 *
 * Handles auth (basic auth with application password), URL building,
 * JSON parsing, error mapping. Every handler in the adapter goes through
 * here — no raw fetch() calls scattered across the codebase.
 *
 * WordPress REST API ref: https://developer.wordpress.org/rest-api/
 */

import type { WordPressAdapterConfig } from "./index.js";

export class WordPressApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    public readonly body: unknown,
  ) {
    const bodyPreview = typeof body === "string" ? body.slice(0, 200) : JSON.stringify(body).slice(0, 200);
    super(`WP REST ${status} on ${endpoint}: ${bodyPreview}`);
    this.name = "WordPressApiError";
  }
}

export interface WPPostSummary {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  type: "post" | "page" | string;
  status: string;
}

export interface WPPost extends WPPostSummary {
  content: { rendered: string; raw?: string };
  excerpt: { rendered: string };
  /** ISO timestamp for last-modified (server local time). Set on every PUT. */
  modified?: string;
  /** ISO timestamp for last-modified (UTC). Preferred for cross-timezone comparisons. */
  modified_gmt?: string;
  /** Some themes / SEO plugins extend the post with these. We read defensively. */
  meta?: Record<string, unknown>;
  yoast_head_json?: Record<string, unknown>;
  rank_math?: Record<string, unknown>;
}

/**
 * Build the Authorization header for WP application passwords.
 * WP accepts the password with or without spaces — we strip them defensively.
 */
function buildAuthHeader(username: string, appPassword: string): string {
  const cleaned = appPassword.replace(/\s+/g, "");
  const token = Buffer.from(`${username}:${cleaned}`).toString("base64");
  return `Basic ${token}`;
}

export class WordPressClient {
  private readonly authHeader: string;
  private readonly baseUrl: string;

  constructor(private readonly config: WordPressAdapterConfig) {
    this.baseUrl = config.siteUrl.replace(/\/$/, "");
    this.authHeader = buildAuthHeader(config.username, config.appPassword);
  }

  /**
   * Untyped REST call. Returns parsed JSON on 2xx, throws WordPressApiError
   * with status + body on non-2xx so callers can branch on error type.
   *
   * Uses the ?rest_route= URL form rather than /wp-json/ paths. This is the
   * universal WordPress REST API format — it works on sites with "plain"
   * permalinks (the default), where /wp-json/ rewrites are not active.
   * Sites with pretty permalinks also accept it.
   */
  async request<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<T> {
    // Path may already have a query string (e.g. "/wp/v2/pages?slug=foo");
    // we have to fold that into a single querystring with rest_route=… first.
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const [routePath, existingQuery] = normalizedPath.split("?", 2);
    let url = `${this.baseUrl}/?rest_route=${encodeURIComponent(routePath!)}`;
    if (existingQuery) url += `&${existingQuery}`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      throw new WordPressApiError(res.status, `${method} ${path}`, parsed);
    }
    return parsed as T;
  }

  // ── High-level helpers ──────────────────────────────────────────────────

  /**
   * Quick health check — calls /wp-json (root, public) and confirms
   * authenticated access via /users/me. Throws on either failure.
   */
  async ping(): Promise<{ siteName: string; wpVersion: string; user: string }> {
    interface RootIndex { name: string; description: string; }
    interface MeRes { name: string; slug: string; }
    interface SiteHealth { wp_version?: string; }

    const root = await this.request<RootIndex>("GET", "/");
    const me = await this.request<MeRes>("GET", "/wp/v2/users/me?context=edit");
    // wp_version isn't reliably exposed without a plugin; we just return what we have.
    return {
      siteName: root.name,
      wpVersion: "unknown",
      user: me.name || me.slug,
    };
  }

  /**
   * Find a post (or page) by its public URL.
   *
   * Handles both common WP URL styles:
   *   - "Pretty" permalinks: https://site.com/test-page/        → look up by slug
   *   - "Plain"  permalinks: https://site.com/?page_id=2         → look up by ID
   *
   * Tries pages first, then posts. Returns null if not found.
   */
  async findPostByUrl(url: string): Promise<WPPostSummary | null> {
    // 1. Try plain-permalink style — ?page_id= or ?p=
    const idFromQuery = extractPostId(url);
    if (idFromQuery) {
      // Try as page first.
      try {
        return await this.request<WPPostSummary>("GET", `/wp/v2/pages/${idFromQuery}?context=edit`);
      } catch {
        // Not a page — try as post.
        try {
          return await this.request<WPPostSummary>("GET", `/wp/v2/posts/${idFromQuery}?context=edit`);
        } catch {
          return null;
        }
      }
    }

    // 2. Pretty-permalink style — look up by slug.
    const slug = extractSlug(url);
    if (!slug) return null;

    for (const type of ["pages", "posts"] as const) {
      const results = await this.request<WPPostSummary[]>(
        "GET",
        `/wp/v2/${type}?slug=${encodeURIComponent(slug)}&context=edit&status=publish,draft,private`,
      );
      if (results.length > 0) return results[0]!;
    }
    return null;
  }

  /**
   * Get full post or page by ID. Caller specifies which endpoint.
   */
  async getPost(type: "post" | "page", id: number): Promise<WPPost> {
    const endpoint = type === "page" ? "pages" : "posts";
    return this.request<WPPost>("GET", `/wp/v2/${endpoint}/${id}?context=edit`);
  }

  /**
   * Update arbitrary fields on a post or page. Returns the updated record.
   */
  async updatePost(
    type: "post" | "page",
    id: number,
    fields: Record<string, unknown>,
  ): Promise<WPPost> {
    const endpoint = type === "page" ? "pages" : "posts";
    return this.request<WPPost>("PUT", `/wp/v2/${endpoint}/${id}`, fields);
  }

  /**
   * Detect which SEO plugin is active on the site. Used by meta + schema
   * handlers to pick the right field names.
   *
   * Returns the highest-priority plugin found, or "none".
   */
  async detectSeoPlugin(): Promise<"yoast" | "rank-math" | "seopress" | "none"> {
    try {
      const plugins = await this.request<Array<{ plugin: string; status: string }>>(
        "GET",
        "/wp/v2/plugins",
      );
      const active = plugins.filter((p) => p.status === "active").map((p) => p.plugin);
      if (active.some((p) => p.startsWith("wordpress-seo/"))) return "yoast";
      if (active.some((p) => p.startsWith("seo-by-rank-math/"))) return "rank-math";
      if (active.some((p) => p.startsWith("wp-seopress/"))) return "seopress";
      return "none";
    } catch {
      // Plugins endpoint requires upload_plugins capability. If we can't read
      // it, fall back to "none" — handlers will use stock WP meta fields.
      return "none";
    }
  }

  /**
   * Detect whether a specific post is managed by a page builder plugin.
   *
   * Page builders (Elementor, Divi, WPBakery, etc.) don't store their
   * content in the standard `post_content` field. Elementor stores its
   * data in a JSON blob under `_elementor_data` post meta; Divi wraps
   * everything in shortcodes; WPBakery uses `[vc_row]` shortcodes.
   *
   * If we modify `post_content` on a page-builder-managed post, the
   * database gets updated but the rendered page is unchanged - the
   * builder ignores post_content and renders from its own storage.
   * That's the "silent failure" we're guarding against.
   *
   * Detection strategy:
   *   - Elementor  : post_meta._elementor_edit_mode = "builder"
   *   - Divi       : post_meta._et_pb_use_builder = "on"
   *   - WPBakery   : post_meta._wpb_vc_js_status = "true"
   *
   * Returns the builder name if one is detected, or null if the post is
   * managed by the standard editor and safe for content modifications.
   */
  async detectPageBuilder(
    type: "post" | "page",
    id: number,
  ): Promise<"elementor" | "divi" | "wpbakery" | null> {
    try {
      const post = await this.getPost(type, id);
      const meta = (post.meta ?? {}) as Record<string, unknown>;

      // Elementor - the most common one by far
      if (meta["_elementor_edit_mode"] === "builder") return "elementor";

      // Divi Builder
      if (meta["_et_pb_use_builder"] === "on") return "divi";

      // WPBakery (formerly Visual Composer)
      if (meta["_wpb_vc_js_status"] === "true") return "wpbakery";

      return null;
    } catch {
      // If we can't read the post's meta for any reason, assume it's a
      // standard editor post. This favors "try to apply" over "skip" -
      // if the apply itself later fails, that's a different error path.
      return null;
    }
  }

  /**
   * Detect active caching plugins on the site. Used by the cache purger
   * so it knows which purge endpoints to hit after a successful apply.
   *
   * Returns the set of known-supported plugins that are currently active.
   * Silently returns an empty array if we can't read `/wp/v2/plugins`
   * (usually a permissions issue on the Application Password).
   *
   * Supported today:
   *   - "wp-rocket"      WP Rocket
   *   - "w3-total-cache" W3 Total Cache
   *   - "litespeed"      LiteSpeed Cache
   *   - "wp-super-cache" WP Super Cache
   */
  async detectCachingPlugins(): Promise<
    Array<"wp-rocket" | "w3-total-cache" | "litespeed" | "wp-super-cache">
  > {
    try {
      const plugins = await this.request<Array<{ plugin: string; status: string }>>(
        "GET",
        "/wp/v2/plugins",
      );
      const active = plugins.filter((p) => p.status === "active").map((p) => p.plugin);
      const detected: Array<
        "wp-rocket" | "w3-total-cache" | "litespeed" | "wp-super-cache"
      > = [];
      if (active.some((p) => p.startsWith("wp-rocket/"))) detected.push("wp-rocket");
      if (active.some((p) => p.startsWith("w3-total-cache/"))) detected.push("w3-total-cache");
      if (active.some((p) => p.startsWith("litespeed-cache/"))) detected.push("litespeed");
      if (active.some((p) => p.startsWith("wp-super-cache/"))) detected.push("wp-super-cache");
      return detected;
    } catch {
      // Plugins endpoint requires upload_plugins capability. Some sites
      // hide it - proceed as if no cache plugin exists rather than
      // blocking apply.
      return [];
    }
  }
}

// ── Utility: extract the URL slug for a post lookup ─────────────────────────

export function extractSlug(url: string): string | null {
  try {
    const u = new URL(url);
    // Strip trailing slash, take the last path segment.
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null; // homepage — slug isn't meaningful
    return parts[parts.length - 1] ?? null;
  } catch {
    return null;
  }
}

/**
 * For "plain" permalink WordPress sites (no slug in URL), the post ID is
 * exposed via ?page_id= or ?p= in the query string. Returns null when
 * neither is present.
 */
export function extractPostId(url: string): number | null {
  try {
    const u = new URL(url);
    const pageId = u.searchParams.get("page_id");
    const postId = u.searchParams.get("p");
    const raw = pageId ?? postId;
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
