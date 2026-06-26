/**
 * applyCreatePage - creates a new WordPress page or post from a
 * Layer 3 create_page action.
 *
 * Process:
 *   1. Resolve target type (post vs page) from action.target.pageType
 *   2. Convert the markdown body to HTML
 *   3. Resolve parent page ID if action.target.parentSlug is set
 *   4. Check for slug collision - if a page/post with the same slug
 *      already exists, switch to update-in-place (idempotent re-run)
 *   5. POST to /wp/v2/pages or /wp/v2/posts to create the page
 *   6. Return the new post ID + URL as ApplyResult
 *
 * Status defaults to "draft" so the human can review before going live.
 * Set CREATE_PAGE_PUBLISH=true in env to publish directly.
 *
 * Page type -> WP endpoint mapping:
 *
 *   pillar / spoke / landing / policy   -> wp/v2/pages
 *   blog                                -> wp/v2/posts
 *   author                              -> not handled here (use create_author)
 */

import { createLogger, optionalEnv } from "@rynk/core";
import type { CreatePageAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient, type WPPost } from "../client.js";
import { markdownToHtml } from "../markdown-to-html.js";

const log = createLogger("layer4.wp.create-page");

/** Page-type -> WP endpoint. "author" handled by applyCreateAuthor instead. */
function resolveEndpoint(pageType: CreatePageAction["target"]["pageType"]): "page" | "post" {
  switch (pageType) {
    case "blog":
      return "post";
    case "pillar":
    case "spoke":
    case "landing":
    case "policy":
    case "author":
    default:
      return "page";
  }
}

export async function applyCreatePage(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "create_page") {
    return { status: "skipped", message: "Not a create_page action" };
  }
  const create = action as CreatePageAction;
  const postType = resolveEndpoint(create.target.pageType);
  const endpoint = postType === "page" ? "pages" : "posts";

  // 1. Resolve parent page ID if needed.
  let parentId: number | undefined;
  if (create.target.parentSlug && postType === "page") {
    try {
      const parents = await client.request<Array<{ id: number; slug: string }>>(
        "GET",
        `/wp/v2/pages?slug=${encodeURIComponent(create.target.parentSlug)}&context=edit&status=publish,draft,private`,
      );
      if (parents.length > 0) parentId = parents[0]!.id;
    } catch {
      // Parent not found - proceed without it (top-level page).
      log.warn("parent slug not found, creating as top-level", {
        actionId: action.id,
        parentSlug: create.target.parentSlug,
      });
    }
  }

  // 2. Convert markdown body -> HTML.
  const contentHtml = markdownToHtml(create.payload.bodyMarkdown);

  // 3. Resolve publish status.
  const publishMode = optionalEnv("CREATE_PAGE_PUBLISH", "false").toLowerCase() === "true";
  const status = publishMode ? "publish" : "draft";

  // 4. Idempotency: check if a page/post with this slug already exists.
  const existing = await findBySlug(client, endpoint, create.target.slug);
  if (existing) {
    // Update in place so re-running this action doesn't create duplicates.
    const updateBody: Record<string, unknown> = {
      title: create.payload.title,
      content: contentHtml,
      slug: create.target.slug,
      status,
    };
    if (create.payload.metaDescription !== null) {
      updateBody["excerpt"] = create.payload.metaDescription;
    }
    if (parentId !== undefined) updateBody["parent"] = parentId;

    const updated = await client.updatePost(postType, existing.id, updateBody);
    log.info("create_page existed - updated in place", {
      actionId: action.id,
      postId: existing.id,
      slug: create.target.slug,
    });
    return {
      status: "applied",
      externalRef: String(existing.id),
      externalUrl: updated.link || existing.link,
      message: `Updated existing ${postType} #${existing.id} ("${create.payload.title}") at slug "${create.target.slug}"`,
    };
  }

  // 5. POST a brand-new page/post.
  const createBody: Record<string, unknown> = {
    title: create.payload.title,
    content: contentHtml,
    slug: create.target.slug,
    status,
  };
  if (create.payload.metaDescription !== null) {
    createBody["excerpt"] = create.payload.metaDescription;
  }
  if (parentId !== undefined) createBody["parent"] = parentId;

  const created = await client.request<WPPost>("POST", `/wp/v2/${endpoint}`, createBody);

  log.info("create_page created", {
    actionId: action.id,
    postId: created.id,
    slug: create.target.slug,
    status,
  });

  return {
    status: "applied",
    externalRef: String(created.id),
    externalUrl: created.link,
    message: `Created ${postType} #${created.id} ("${create.payload.title}") as ${status}`,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function findBySlug(
  client: WordPressClient,
  endpoint: "pages" | "posts",
  slug: string,
): Promise<{ id: number; link: string } | null> {
  try {
    const results = await client.request<Array<{ id: number; link: string; slug: string }>>(
      "GET",
      `/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&context=edit&status=publish,draft,private,pending,future`,
    );
    return results.length > 0 ? { id: results[0]!.id, link: results[0]!.link } : null;
  } catch {
    return null;
  }
}
