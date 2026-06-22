/**
 * Shared utilities used across components.
 * Keep this tiny — large utilities live in feature-specific modules.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with conflict resolution.
 * Standard shadcn/ui helper — used by every component for className composition.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number with thousands separator. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format an ISO date as a short, friendly string ("Jun 12, 2026"). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
