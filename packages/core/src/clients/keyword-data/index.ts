/**
 * Factory + re-exports for the KeywordDataProvider module.
 *
 * To swap providers in production:
 *   1. Add a new class implementing KeywordDataProvider (e.g. SemrushProvider)
 *   2. Add a case in getKeywordDataProvider() below
 *   3. Set KEYWORD_DATA_PROVIDER=semrush in .env
 *
 * No agent, generator, or schema needs to know which provider is active.
 */

import { optionalEnv } from "../../utils/env.js";
import type { KeywordDataProvider } from "./types.js";
import { MockKeywordDataProvider } from "./mock.js";

export * from "./types.js";
export { MockKeywordDataProvider } from "./mock.js";

let cached: KeywordDataProvider | null = null;

/**
 * Memoized factory. Reads KEYWORD_DATA_PROVIDER env var; defaults to "mock".
 *
 * Available providers (more to come):
 *   - "mock"        — deterministic fake data, free, default in dev
 *   - "semrush"     — TODO when API access confirmed
 *   - "ahrefs"      — TODO if we pick Ahrefs
 *   - "dataforseo"  — TODO cheap fallback
 */
export function getKeywordDataProvider(): KeywordDataProvider {
  if (cached) return cached;
  const name = optionalEnv("KEYWORD_DATA_PROVIDER", "mock").toLowerCase();
  switch (name) {
    case "mock":
      cached = new MockKeywordDataProvider();
      break;
    // case "semrush":
    //   cached = new SemrushKeywordDataProvider();
    //   break;
    // case "ahrefs":
    //   cached = new AhrefsKeywordDataProvider();
    //   break;
    // case "dataforseo":
    //   cached = new DataForSEOKeywordDataProvider();
    //   break;
    default:
      throw new Error(
        `Unknown KEYWORD_DATA_PROVIDER "${name}". ` +
          `Supported: mock. (semrush/ahrefs/dataforseo coming soon.)`,
      );
  }
  return cached;
}

/**
 * Test helper — reset the memoized provider. Tests can swap in their own
 * implementation by calling setKeywordDataProvider() after this.
 */
export function _resetKeywordDataProviderCache(): void {
  cached = null;
}

/** Test helper — inject a custom provider directly. Not used in production. */
export function _setKeywordDataProvider(provider: KeywordDataProvider): void {
  cached = provider;
}
