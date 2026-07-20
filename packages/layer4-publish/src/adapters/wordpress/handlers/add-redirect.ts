/**
 * applyAddRedirect — creates or updates a redirect via the Redirection plugin
 * REST API (https://wordpress.org/plugins/redirection/).
 *
 * WordPress core has no native redirect support. This handler requires the
 * free Redirection plugin, which registers routes at /redirection/v1/redirect.
 *
 * Idempotency: if a redirect for the same source path already exists, we
 * update its target + status code instead of creating a duplicate.
 */

import { createLogger } from "@rynk/core";
import type { AddRedirectAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.add-redirect");

const REDIRECTION_SKIP_MESSAGE =
  "Redirection plugin is not installed or active. Install the free Redirection plugin (https://wordpress.org/plugins/redirection/) to apply redirect actions.";

interface RedirectionItem {
  id: number;
  url: string;
  action_code: number;
  action_data?: { url?: string };
}

interface RedirectionListResponse {
  items?: RedirectionItem[];
}

/** Normalize a manifest URL to the path Redirection expects (leading slash). */
function urlToRedirectPath(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    return path.startsWith("/") ? path : `/${path}`;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function buildRedirectBody(sourcePath: string, targetPath: string, statusCode: 301 | 302) {
  return {
    url: sourcePath,
    match_type: "url",
    action_type: "url",
    action_code: statusCode,
    action_data: { url: targetPath },
    group_id: 1,
    enabled: true,
  };
}

function extractRedirectId(value: unknown): number | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id === "number") return record.id;
  if (typeof record.item === "object" && record.item !== null) {
    const item = record.item as Record<string, unknown>;
    if (typeof item.id === "number") return item.id;
  }
  return null;
}

async function findExistingRedirect(
  client: WordPressClient,
  sourcePath: string,
): Promise<RedirectionItem | null> {
  const res = await client.request<RedirectionListResponse>(
    "GET",
    `/redirection/v1/redirect?filterBy[url]=${encodeURIComponent(sourcePath)}&per_page=5`,
  );
  const items = res.items ?? [];
  return items.find((item) => item.url === sourcePath) ?? items[0] ?? null;
}

export async function applyAddRedirect(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "add_redirect") {
    return { status: "skipped", message: "Not an add_redirect action" };
  }
  const redirect = action as AddRedirectAction;

  if (!(await client.isRedirectionPluginActive())) {
    log.info("redirect skipped — Redirection plugin not active", { actionId: action.id });
    return { status: "skipped", message: REDIRECTION_SKIP_MESSAGE };
  }

  const sourcePath = urlToRedirectPath(redirect.target.sourceUrl);
  const targetPath = urlToRedirectPath(redirect.target.targetUrl);
  const statusCode = redirect.payload.statusCode;
  const body = buildRedirectBody(sourcePath, targetPath, statusCode);

  const existing = await findExistingRedirect(client, sourcePath);

  if (existing) {
    const updated = await client.request<unknown>(
      "PUT",
      `/redirection/v1/redirect/${existing.id}`,
      body,
    );
    const redirectId = extractRedirectId(updated) ?? existing.id;
    log.info("redirect updated", {
      actionId: action.id,
      redirectId,
      sourcePath,
      targetPath,
      statusCode,
    });
    return {
      status: "applied",
      externalRef: String(redirectId),
      message: `Updated redirect #${redirectId}: ${sourcePath} → ${targetPath} (${statusCode})`,
    };
  }

  const created = await client.request<unknown>("POST", "/redirection/v1/redirect", body);
  const redirectId = extractRedirectId(created);
  log.info("redirect created", {
    actionId: action.id,
    redirectId,
    sourcePath,
    targetPath,
    statusCode,
  });

  return {
    status: "applied",
    externalRef: redirectId != null ? String(redirectId) : null,
    message: `Created redirect${redirectId != null ? ` #${redirectId}` : ""}: ${sourcePath} → ${targetPath} (${statusCode})`,
  };
}
