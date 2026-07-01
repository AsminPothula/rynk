/**
 * applyAssignAuthor — sets post.author on a WP post/page so it carries
 * the byline from a prior create_author action.
 *
 * Process:
 *   1. Find the post/page by action.target.postUrl
 *   2. Look up the author user by slug
 *   3. PUT { author: userId } via client.updatePost
 *
 * Returns ApplyResult with externalRef = post ID, externalUrl = post URL.
 */

import { createLogger } from "@rynk/core";
import type { AssignAuthorAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.assign-author");

interface WPUser {
  id: number;
  name: string;
  slug: string;
}

export async function applyAssignAuthor(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "assign_author") {
    return { status: "skipped", message: "Not an assign_author action" };
  }
  const assign = action as AssignAuthorAction;
  const { postUrl, authorUsername } = assign.target;

  const summary = await client.findPostByUrl(postUrl);
  if (!summary) {
    return { status: "failed", error: `No post or page found at ${postUrl}` };
  }

  const users = await client.request<WPUser[]>(
    "GET",
    `/wp/v2/users?slug=${encodeURIComponent(authorUsername)}`,
  );
  const author = users[0];
  if (!author) {
    return {
      status: "failed",
      error: `No WordPress user found with username "${authorUsername}". Run create_author first.`,
    };
  }

  const postType = summary.type === "page" ? "page" : "post";
  const updated = await client.updatePost(postType, summary.id, { author: author.id });

  log.info("assign_author applied", {
    actionId: action.id,
    postId: summary.id,
    authorId: author.id,
    authorUsername,
  });

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `Assigned @${authorUsername} to ${postType} #${summary.id}`,
  };
}
