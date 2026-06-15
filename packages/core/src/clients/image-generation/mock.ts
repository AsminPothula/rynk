/**
 * MockImageGenerationProvider — deterministic placeholder URLs.
 *
 * Uses placehold.co (a public placeholder image service) so the returned
 * URL is real and reachable. The image is just a gray rectangle of the
 * right dimensions with the prompt's first few words rendered on top.
 *
 * Lets Layer 4's image adapter be exercised end-to-end without spending
 * money on real image generation. Swap to a real provider via the
 * IMAGE_GENERATION_PROVIDER env var.
 */

import type {
  ImageGenerationProvider,
  GenerateImageOptions,
  GeneratedImage,
} from "./types.js";

function stableHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function summarisePromptForImageText(prompt: string): string {
  // Keep just the first 3-4 meaningful words for the placeholder text.
  return prompt
    .split(/\s+/)
    .slice(0, 4)
    .join("+")
    .replace(/[^a-zA-Z0-9+]/g, "")
    .slice(0, 40);
}

export class MockImageGenerationProvider implements ImageGenerationProvider {
  readonly providerName = "mock";

  async generate(opts: GenerateImageOptions): Promise<GeneratedImage> {
    const text = summarisePromptForImageText(opts.prompt);
    const url = `https://placehold.co/${opts.width}x${opts.height}/EEE/444?text=${text || "rynk+mock"}`;
    return {
      url,
      width: opts.width,
      height: opts.height,
      externalId: `mock-${stableHash(opts.prompt + opts.width + opts.height)}`,
      provider: this.providerName,
      costCents: 0,
    };
  }
}
