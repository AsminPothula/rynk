/**
 * Factory + re-exports for OwnedDomainDataProvider.
 *
 * To switch from mock to real GSC/GA in production:
 *   1. Implement GSCProvider (Google Search Console) and GAProvider (Analytics)
 *   2. Add a composer that fans out method calls to the right backend
 *   3. Add a case in getOwnedDomainDataProvider() below
 *   4. Set OWNED_DOMAIN_DATA_PROVIDER=gsc-ga in .env
 */

import { optionalEnv } from "../../utils/env.js";
import type { OwnedDomainDataProvider } from "./types.js";
import { MockOwnedDomainDataProvider } from "./mock.js";

export * from "./types.js";
export { MockOwnedDomainDataProvider } from "./mock.js";

let cached: OwnedDomainDataProvider | null = null;

/**
 * Available providers:
 *   - "mock"   — deterministic fake data, default
 *   - "gsc-ga" — TODO real Google Search Console + Analytics composer
 */
export function getOwnedDomainDataProvider(): OwnedDomainDataProvider {
  if (cached) return cached;
  const name = optionalEnv("OWNED_DOMAIN_DATA_PROVIDER", "mock").toLowerCase();
  switch (name) {
    case "mock":
      cached = new MockOwnedDomainDataProvider();
      break;
    // case "gsc-ga":
    //   cached = new GoogleOwnedDomainDataProvider();
    //   break;
    default:
      throw new Error(
        `Unknown OWNED_DOMAIN_DATA_PROVIDER "${name}". Supported: mock.`,
      );
  }
  return cached;
}

export function _resetOwnedDomainDataProviderCache(): void {
  cached = null;
}

export function _setOwnedDomainDataProvider(
  provider: OwnedDomainDataProvider,
): void {
  cached = provider;
}
