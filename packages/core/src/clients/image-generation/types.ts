/**
 * ImageGenerationProvider — provider-agnostic interface for AI image
 * generation services (DALL-E, Flux, Stable Diffusion, Imagen, etc.).
 *
 * Why an interface:
 *   We don't yet know which provider rynk will use in production. The
 *   choice depends on quality, cost, and what the team is most comfortable
 *   billing through. Behind this interface, every caller (Layer 4 image
 *   adapter today, future regeneration flows) stays untouched when we
 *   swap providers.
 *
 * Normalized return shape:
 *   Each provider's raw response — base64 blob, signed URL, hosted URL —
 *   gets mapped to a single `GeneratedImage` record. Callers handle one
 *   shape regardless of vendor.
 *
 * All methods are async and may throw on transport errors.
 */

/** A successfully-generated image. */
export interface GeneratedImage {
  /** Direct URL to the image — usually a CDN URL the provider hosts. */
  url: string;
  /** Width in pixels (matches the request). */
  width: number;
  /** Height in pixels (matches the request). */
  height: number;
  /** Provider-specific image ID — useful for re-fetching or attribution. */
  externalId: string | null;
  /** "dalle3", "flux-pro", "imagen3", "mock", etc. */
  provider: string;
  /** Cents charged for this generation, when known. Null = provider didn't expose cost. */
  costCents: number | null;
}

/** Options for a single image-generation request. */
export interface GenerateImageOptions {
  /** Text prompt describing the desired image. */
  prompt: string;
  /** Output width in pixels. Provider may snap to nearest supported size. */
  width: number;
  /** Output height in pixels. */
  height: number;
  /**
   * Optional style hint — providers handle this differently (DALL-E has
   * "vivid"/"natural", Flux has model variants, Stable Diffusion has
   * LoRAs). The provider implementation maps to its own vocabulary.
   */
  style?: "photo" | "illustration" | "diagram" | "sketch" | "3d";
  /** Optional negative prompt for providers that support it. */
  negativePrompt?: string;
}

/**
 * Provider-agnostic image generation interface.
 *
 * Implementations:
 *   - MockImageGenerationProvider (this repo) — placeholder URLs, no real generation
 *   - DalleImageProvider (TODO — wraps OpenAI Images API)
 *   - FluxImageProvider (TODO — wraps fal.ai or Replicate Flux endpoint)
 *   - ImagenImageProvider (TODO — Google Vertex AI Imagen)
 */
export interface ImageGenerationProvider {
  /** Name of the provider for logging + manifest provenance. */
  readonly providerName: string;

  /**
   * Generate one image. Returns a fully-formed GeneratedImage record.
   * Throws on auth / transport / quota errors.
   */
  generate(opts: GenerateImageOptions): Promise<GeneratedImage>;
}
