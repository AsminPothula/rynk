/**
 * Channel display helpers — single source of truth for how each
 * execution-manifest channel is labeled and styled in the UI.
 *
 * Centralized so the dashboard can't render a channel inconsistently
 * across pages. When new channels are added in @rynk/layer3-generate,
 * extend this file (and only this file).
 */

import type { ActionChannel } from "@rynk/layer3-generate";

/** Map every channel to its display name + Badge variant. */
export const CHANNEL_META: Record<
  ActionChannel,
  { label: string; badgeVariant: string }
> = {
  cms: { label: "CMS", badgeVariant: "channel-cms" },
  image: { label: "Images", badgeVariant: "channel-image" },
  outreach: { label: "Outreach", badgeVariant: "channel-outreach" },
  social: { label: "Social", badgeVariant: "channel-social" },
  "code-pr": { label: "Code PRs", badgeVariant: "channel-code-pr" },
  document: { label: "Documents", badgeVariant: "channel-document" },
  offsite: { label: "Offsite", badgeVariant: "channel-offsite" },
};

/** Stable list ordering for rendering grouped views. */
export const CHANNEL_ORDER: ActionChannel[] = [
  "cms",
  "image",
  "outreach",
  "social",
  "code-pr",
  "document",
  "offsite",
];
