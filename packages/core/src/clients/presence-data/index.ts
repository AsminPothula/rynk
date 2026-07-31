/**
 * Factory + re-exports for PresenceDataProvider.
 *
 * To switch from mock to real data in production:
 *   1. Implement providers: a Google Business Profile / Places client, a
 *      citation service (BrightLocal / Yext / DataForSEO-local), and a geo SERP
 *      source (SerpApi / DataForSEO) — compose them behind PresenceDataProvider.
 *   2. Add a case in getPresenceDataProvider() below.
 *   3. Set PRESENCE_DATA_PROVIDER=<name> in .env.
 *
 * No agent, collector, or schema needs to know which backend is active.
 */

import { optionalEnv } from "../../utils/env.js";
import type { PresenceDataProvider } from "./types.js";
import { MockPresenceDataProvider } from "./mock.js";

export * from "./types.js";
export { MockPresenceDataProvider } from "./mock.js";

let cached: PresenceDataProvider | null = null;

/**
 * Memoized factory. Reads PRESENCE_DATA_PROVIDER env var; defaults to "mock".
 *
 * Available providers (more to come):
 *   - "mock"        — deterministic fake data, default in dev
 *   - "gbp"         — TODO Google Business Profile + Places
 *   - "brightlocal" — TODO citations + reviews
 *   - "dataforseo"  — TODO cheap geo SERP + local data
 */
export function getPresenceDataProvider(): PresenceDataProvider {
  if (cached) return cached;
  const name = optionalEnv("PRESENCE_DATA_PROVIDER", "mock").toLowerCase();
  switch (name) {
    case "mock":
      cached = new MockPresenceDataProvider();
      break;
    default:
      throw new Error(
        `Unknown PRESENCE_DATA_PROVIDER "${name}". Supported: mock. ` +
          `(gbp / brightlocal / dataforseo coming soon.)`,
      );
  }
  return cached;
}

/** Test helper — reset the memoized provider. */
export function _resetPresenceDataProviderCache(): void {
  cached = null;
}
