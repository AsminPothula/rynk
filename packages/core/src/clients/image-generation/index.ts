/**
 * Factory + re-exports for ImageGenerationProvider.
 *
 * To wire a real provider in production:
 *   1. Add a new class implementing ImageGenerationProvider
 *      (e.g. DalleImageProvider or FluxImageProvider)
 *   2. Add a case in getImageGenerationProvider() below
 *   3. Set IMAGE_GENERATION_PROVIDER=dalle (or flux / imagen) in .env
 *   4. Set the matching API key env var
 *
 * No agent, generator, or adapter needs to know which provider is active.
 */

import { optionalEnv } from "../../utils/env.js";
import type { ImageGenerationProvider } from "./types.js";
import { MockImageGenerationProvider } from "./mock.js";

export * from "./types.js";
export { MockImageGenerationProvider } from "./mock.js";

let cached: ImageGenerationProvider | null = null;

/**
 * Memoized factory. Reads IMAGE_GENERATION_PROVIDER env var; defaults to "mock".
 *
 * Available providers (more to come — see INTERN_TASKS for the implementation
 * task):
 *   - "mock"   — placeholder URLs via placehold.co, free
 *   - "dalle"  — TODO OpenAI DALL-E 3 (~$0.04–$0.08 per image)
 *   - "flux"   — TODO Flux via fal.ai or Replicate (~$0.02–$0.05 per image)
 *   - "imagen" — TODO Google Vertex AI Imagen 3
 */
export function getImageGenerationProvider(): ImageGenerationProvider {
  if (cached) return cached;
  const name = optionalEnv("IMAGE_GENERATION_PROVIDER", "mock").toLowerCase();
  switch (name) {
    case "mock":
      cached = new MockImageGenerationProvider();
      break;
    // case "dalle":
    //   cached = new DalleImageProvider();
    //   break;
    // case "flux":
    //   cached = new FluxImageProvider();
    //   break;
    // case "imagen":
    //   cached = new ImagenImageProvider();
    //   break;
    default:
      throw new Error(
        `Unknown IMAGE_GENERATION_PROVIDER "${name}". ` +
          `Supported: mock. (dalle / flux / imagen coming soon.)`,
      );
  }
  return cached;
}

export function _resetImageGenerationProviderCache(): void {
  cached = null;
}

export function _setImageGenerationProvider(provider: ImageGenerationProvider): void {
  cached = provider;
}
