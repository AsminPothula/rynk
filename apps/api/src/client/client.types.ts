import { randomUUID } from 'crypto';

export enum ClientStatus {
  /** Onboarding job kicked off, not yet finished. */
  Onboarding = 'Onboarding',
  /** client.json extracted + stored; ready to run the pipeline. */
  Onboarded = 'Onboarded',
  /** Onboarding job failed (scrape/extract error). */
  Failed = 'Failed',
}
export type ClientStatusType = `${ClientStatus}`;

/** A client is one onboarded domain, owned by a rynk user. */
export class Client {
  private constructor(
    private _id: string,
    private _domain: string,
    private _name: string,
    private _ownerId: string,
    private _status: ClientStatusType,
    private _context: Record<string, unknown> | null,
    private _createdAt?: Date,
    private _updatedAt?: Date,
    private _deletedAt?: Date | null,
  ) {}

  static createNew(params: { domain: string; name?: string; ownerId: string }) {
    const { domain, name, ownerId } = params;
    return Client.create({
      id: randomUUID(),
      domain,
      name: name ?? domain,
      ownerId,
      status: ClientStatus.Onboarding,
      context: null,
    });
  }

  static create(params: {
    id: string;
    domain: string;
    name: string;
    ownerId: string;
    status: ClientStatusType;
    context: Record<string, unknown> | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    return new Client(
      params.id,
      params.domain,
      params.name,
      params.ownerId,
      params.status,
      params.context,
      params.createdAt,
      params.updatedAt,
      params.deletedAt,
    );
  }

  get id() {
    return this._id;
  }
  get domain() {
    return this._domain;
  }
  get name() {
    return this._name;
  }
  get ownerId() {
    return this._ownerId;
  }
  get status() {
    return this._status;
  }
  get context() {
    return this._context;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get deletedAt() {
    return this._deletedAt;
  }

  /** Onboarding finished: store the extracted context, mark ready. */
  markOnboarded(context: Record<string, unknown>) {
    this._context = context;
    this._status = ClientStatus.Onboarded;
    // Prefer the legal entity name the pipeline extracted, if present.
    const legalEntity = context['legalEntity'];
    if (typeof legalEntity === 'string' && legalEntity.trim()) {
      this._name = legalEntity;
    }
    return this;
  }

  markFailed() {
    this._status = ClientStatus.Failed;
    return this;
  }

  /**
   * Apply a partial profile edit to the stored ClientContext.
   *
   * Deep-merges plain-object branches (so a `brand` or `presence` patch only
   * touches the fields it names) while replacing scalars and arrays wholesale
   * (editing `competitors` or `goals` replaces the whole list, as the UI sends
   * the full new array). Also mirrors `legalEntity`/`name` onto the display
   * name so the clients list stays in sync. Returns the merged context so the
   * caller can persist it to client.json for the pipeline.
   */
  updateProfile(patch: Record<string, unknown>): Record<string, unknown> {
    const base = this._context ?? {};
    const merged = deepMerge(base, patch);
    this._context = merged;
    this._updatedAt = new Date();

    const legalEntity = merged['legalEntity'];
    if (typeof legalEntity === 'string' && legalEntity.trim()) {
      this._name = legalEntity;
    }
    return merged;
  }

  isOwnedBy(userId: string) {
    return this._ownerId === userId;
  }
}

/** Plain-object check (not arrays, not null). */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Recursively merge `patch` into `base`; arrays and scalars replace. */
function deepMerge(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }
    const existing = out[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      out[key] = deepMerge(existing, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export class FindClientSpecs {
  private _id?: string;
  get id() {
    return this._id;
  }
  setId(value?: string) {
    this._id = value ?? undefined;
    return this;
  }

  private _domain?: string;
  get domain() {
    return this._domain;
  }
  setDomain(value?: string) {
    this._domain = value ?? undefined;
    return this;
  }

  private _ownerId?: string;
  get ownerId() {
    return this._ownerId;
  }
  setOwnerId(value?: string) {
    this._ownerId = value ?? undefined;
    return this;
  }

  private _limit = 50;
  get limit() {
    return this._limit;
  }
  setLimit(value: number) {
    this._limit = value;
    return this;
  }

  private _offset = 0;
  get offset() {
    return this._offset;
  }
  setOffset(value: number) {
    this._offset = value;
    return this;
  }
}
