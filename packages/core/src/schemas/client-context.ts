import { z } from "zod";

export const TeamContextSchema = z.object({
  hasDev: z.boolean(),
  hasContent: z.boolean(),
  hasMarketing: z.boolean(),
  hasLegal: z.boolean(),
  notes: z.string().optional(),
});

export const SprintContextSchema = z.object({
  cadence: z.enum(["weekly", "biweekly", "monthly"]),
  budget: z.enum(["low", "medium", "high"]),
  notes: z.string().optional(),
});

export const CanonicalNAPSchema = z.object({
  // All NAP fields are nullable — address/phone are commonly unknown for new clients,
  // and a missing field must never block a pipeline run.
  address: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
});

export const FounderSchema = z.object({
  name: z.string(),
  credentials: z.array(z.string()),
});

// ── Brand context ──────────────────────────────────────────────────────────────
// What rynk understands about the business's identity and voice. Everything the
// onboarding agent infers from the site; anything it can't determine is left
// empty for the client to complete. Powers the dashboard "Profile" tab and gives
// the content/keyword generators the voice + positioning they need.

export const PersonaSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
});

export const BrandVoiceSchema = z.object({
  /** How the brand sounds, in a phrase — e.g. "warm, plain-spoken, confident". */
  tone: z.string().default(""),
  /** Personality adjectives. */
  personality: z.array(z.string()).default([]),
  /** Words / claims to avoid. */
  avoid: z.array(z.string()).default([]),
});

export const BrandProductSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
});

export const BrandAssetsSchema = z.object({
  logoUrl: z.string().default(""),
  brandColors: z.array(z.string()).default([]),
  photoUrls: z.array(z.string()).default([]),
});

export const BrandContextSchema = z.object({
  /** One-line description of what the business is / does. */
  description: z.string().default(""),
  /** The core promise / why a customer should choose them. */
  valueProposition: z.string().default(""),
  /** What sets them apart from competitors. */
  differentiators: z.array(z.string()).default([]),
  /** Who they serve, beyond the single-sentence `icp`. */
  personas: z.array(PersonaSchema).default([]),
  voice: BrandVoiceSchema.default({}),
  /** Content pillars / recurring themes rynk should write around. */
  contentThemes: z.array(z.string()).default([]),
  /** Products / service offerings as brand entities. */
  products: z.array(BrandProductSchema).default([]),
  /** Freeform brand / writing guidelines the generators must respect. */
  guidelines: z.string().default(""),
  /** Content languages, e.g. ["en", "es"]. */
  languages: z.array(z.string()).default([]),
  /** Geographic / content markets served. */
  markets: z.array(z.string()).default([]),
  assets: BrandAssetsSchema.default({}),
});

// ── Presence & reputation context ──────────────────────────────────────────────
// Physical presence, service area, listings and reviews. General — applies to any
// client that has a location or a reputation to manage (not just "local"); it just
// stays empty for pure-online businesses.

export const BusinessLocationSchema = z.object({
  label: z.string().default(""),
  address: z.string().default(""),
  phone: z.string().default(""),
});

export const OpeningHoursSchema = z.object({
  day: z.string(), // Mon..Sun
  open: z.string(), // "09:00"
  close: z.string(), // "18:00"
});

export const ServiceOfferingSchema = z.object({
  name: z.string(),
  /** String, not number, to allow ranges like "from $40". */
  price: z.string().default(""),
  description: z.string().default(""),
});

export const ReviewProfileSchema = z.object({
  platform: z.string(), // "google" | "yelp" | "facebook" | ...
  url: z.string(),
});

export const DirectoryListingSchema = z.object({
  name: z.string(), // "Yelp", "Apple Maps", ...
  url: z.string().default(""),
});

export const PresenceContextSchema = z.object({
  /** True if the business has a physical location or serves a defined area. */
  hasPhysicalPresence: z.boolean().default(false),
  locations: z.array(BusinessLocationSchema).default([]),
  /** Cities / regions the business serves. */
  serviceAreas: z.array(z.string()).default([]),
  /** Primary business category (Google-Business-Profile style). */
  primaryCategory: z.string().default(""),
  secondaryCategories: z.array(z.string()).default([]),
  hours: z.array(OpeningHoursSchema).default([]),
  services: z.array(ServiceOfferingSchema).default([]),
  bookingUrl: z.string().default(""),
  reviewProfiles: z.array(ReviewProfileSchema).default([]),
  directoryListings: z.array(DirectoryListingSchema).default([]),
});

export const ClientContextSchema = z.object({
  domain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "domain must be bare host like 'example.com'"),
  legalEntity: z.string().default(""),
  relatedEntities: z.array(z.string()).default([]),
  canonicalNAP: CanonicalNAPSchema,
  industry: z.string(),
  verticals: z.array(z.string()),
  icp: z.string(),
  founder: FounderSchema.optional(),
  certificationsClaimed: z.array(z.string()).default([]),
  competitors: z.array(z.string()).default([]),
  goals: z.array(z.string()),
  team: TeamContextSchema,
  sprint: SprintContextSchema,
  seedKeywords: z.array(z.string()).default([]),
  knownIssues: z.array(z.string()).default([]),
  cms: z.string().nullable().default(null),
  hosting: z.string().nullable().default(null),
  cdn: z.string().nullable().default(null),
  // Identity + presence. Both default to empty so existing client.json files and
  // partially-known clients validate cleanly; onboarding fills what it can.
  brand: BrandContextSchema.default({}),
  presence: PresenceContextSchema.default({}),
});

export type TeamContext = z.infer<typeof TeamContextSchema>;
export type SprintContext = z.infer<typeof SprintContextSchema>;
export type CanonicalNAP = z.infer<typeof CanonicalNAPSchema>;
export type Founder = z.infer<typeof FounderSchema>;
export type Persona = z.infer<typeof PersonaSchema>;
export type BrandVoice = z.infer<typeof BrandVoiceSchema>;
export type BrandContext = z.infer<typeof BrandContextSchema>;
export type BusinessLocation = z.infer<typeof BusinessLocationSchema>;
export type ServiceOffering = z.infer<typeof ServiceOfferingSchema>;
export type PresenceContext = z.infer<typeof PresenceContextSchema>;
export type ClientContext = z.infer<typeof ClientContextSchema>;
