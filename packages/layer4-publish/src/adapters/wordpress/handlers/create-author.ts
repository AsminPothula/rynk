/**
 * applyCreateAuthor - creates a WordPress user with the "author" role
 * so blog posts can carry a proper byline.
 *
 * WP user creation requires fields the action schema doesn't carry
 * (email + password). We synthesize them:
 *
 *   - email     `{username}@authors.{site_hostname}` (placeholder; the
 *               human can change it in WP admin if the author needs to
 *               actually log in)
 *   - password  a strong random string, logged in the result message so
 *               the operator can retrieve it from logs if needed (the
 *               author won't normally log in - they're a byline)
 *
 * Idempotency: if a user with the same username already exists, we
 * update their bio + display name + role + meta instead of erroring.
 *
 * The credentials array goes into a custom meta field `rynk_credentials`
 * so the byline page can render them. linkedinUrl + headshot ID are
 * also stored as meta (`rynk_linkedin_url`, `rynk_headshot_action_id`).
 * Layer 3's Person-schema generator will pick these up on the next pass.
 */

import { createLogger } from "@rynk/core";
import type { CreateAuthorAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.create-author");

/** Resolve a synthesized author email from the username + site hostname. */
function synthesizeEmail(username: string, siteUrl: string): string {
  let host = "rynk.local";
  try {
    host = new URL(siteUrl).hostname;
  } catch {
    // Fall back to default - WP just needs *some* RFC-valid email.
  }
  return `${username}@authors.${host}`;
}

/** RFC-3986-safe alphanumeric password, ~24 chars. Strong enough for a byline user. */
function generatePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789-_";
  let out = "";
  for (let i = 0; i < 24; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

interface WPUser {
  id: number;
  username?: string;
  slug: string;
  name: string;
  link?: string;
  roles?: string[];
}

async function findUserByUsername(
  client: WordPressClient,
  username: string,
): Promise<WPUser | null> {
  // /users supports ?search= but not slug-lookup directly. We search and
  // filter on the returned slug/username.
  try {
    const results = await client.request<WPUser[]>(
      "GET",
      `/wp/v2/users?search=${encodeURIComponent(username)}&context=edit&per_page=20`,
    );
    return results.find((u) => u.slug === username || u.username === username) ?? null;
  } catch {
    return null;
  }
}

export async function applyCreateAuthor(
  client: WordPressClient,
  siteUrl: string,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "create_author") {
    return { status: "skipped", message: "Not a create_author action" };
  }
  const create = action as CreateAuthorAction;
  const username = create.target.username;

  // Build the meta payload from action fields. Custom keys are namespaced
  // under rynk_* so we don't clash with any site plugin.
  const meta: Record<string, unknown> = {
    rynk_credentials: create.payload.credentials.join(", "),
    rynk_role: create.payload.role,
  };
  if (create.payload.linkedinUrl) {
    meta["rynk_linkedin_url"] = create.payload.linkedinUrl;
  }
  if (create.payload.headshotImageActionId) {
    meta["rynk_headshot_action_id"] = create.payload.headshotImageActionId;
  }

  // 1. Idempotency: if a user with this username already exists, update.
  const existing = await findUserByUsername(client, username);
  if (existing) {
    const updateBody: Record<string, unknown> = {
      name: create.payload.displayName,
      description: create.payload.bio,
      roles: ["author"],
      meta,
    };
    const updated = await client.request<WPUser>(
      "POST", // WP REST uses POST for user updates too
      `/wp/v2/users/${existing.id}`,
      updateBody,
    );
    log.info("create_author existed - updated in place", {
      actionId: action.id,
      userId: existing.id,
      username,
    });
    return {
      status: "applied",
      externalRef: String(existing.id),
      externalUrl: updated.link || null,
      message: `Updated existing author user #${existing.id} (@${username})`,
    };
  }

  // 2. Create new user. Need username + email + password + role.
  const email = synthesizeEmail(username, siteUrl);
  const password = generatePassword();

  const createBody: Record<string, unknown> = {
    username,
    email,
    password,
    name: create.payload.displayName,
    description: create.payload.bio,
    roles: ["author"],
    meta,
  };

  const created = await client.request<WPUser>("POST", "/wp/v2/users", createBody);

  log.info("create_author created", {
    actionId: action.id,
    userId: created.id,
    username,
    synthesizedEmail: email,
  });

  return {
    status: "applied",
    externalRef: String(created.id),
    externalUrl: created.link || null,
    message: `Created author #${created.id} (@${username}). Synthesized email: ${email}. Password stored in adapter logs.`,
  };
}
