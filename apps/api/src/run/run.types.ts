import { randomUUID } from 'crypto';

/**
 * Phases match exactly what the pipeline writes to runs/{slug}/status.json
 * (packages/orchestrator/src/web/run-status.ts), so we can sync the DB row
 * straight from that file.
 */
export enum RunPhase {
  Onboarding = 'onboarding',
  Onboarded = 'onboarded',
  Layer1 = 'layer1',
  Layer2 = 'layer2',
  Layer3 = 'layer3',
  Done = 'done',
  Failed = 'failed',
}
export type RunPhaseType = `${RunPhase}`;

const TERMINAL_PHASES: RunPhaseType[] = [RunPhase.Done, RunPhase.Failed];

/** One pipeline execution (Layers 1-3) for a client. */
export class Run {
  private constructor(
    private _id: string,
    private _clientId: string,
    private _domain: string,
    private _phase: RunPhaseType,
    private _error: string | null,
    private _startedAt: Date,
    private _completedAt: Date | null,
    private _createdAt?: Date,
    private _updatedAt?: Date,
    private _deletedAt?: Date | null,
  ) {}

  static createNew(params: { clientId: string; domain: string }) {
    return Run.create({
      id: randomUUID(),
      clientId: params.clientId,
      domain: params.domain,
      phase: RunPhase.Layer1,
      error: null,
      startedAt: new Date(),
      completedAt: null,
    });
  }

  static create(params: {
    id: string;
    clientId: string;
    domain: string;
    phase: RunPhaseType;
    error: string | null;
    startedAt: Date;
    completedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    return new Run(
      params.id,
      params.clientId,
      params.domain,
      params.phase,
      params.error,
      params.startedAt,
      params.completedAt,
      params.createdAt,
      params.updatedAt,
      params.deletedAt,
    );
  }

  get id() {
    return this._id;
  }
  get clientId() {
    return this._clientId;
  }
  get domain() {
    return this._domain;
  }
  get phase() {
    return this._phase;
  }
  get error() {
    return this._error;
  }
  get startedAt() {
    return this._startedAt;
  }
  get completedAt() {
    return this._completedAt;
  }
  get createdAt() {
    return this._createdAt;
  }

  isTerminal() {
    return TERMINAL_PHASES.includes(this._phase);
  }

  /** Pull the latest phase from what the pipeline wrote to status.json. */
  syncPhase(phase: RunPhaseType, error: string | null) {
    this._phase = phase;
    this._error = error;
    if (TERMINAL_PHASES.includes(phase) && !this._completedAt) {
      this._completedAt = new Date();
    }
    return this;
  }
}

export class FindRunSpecs {
  private _id?: string;
  get id() {
    return this._id;
  }
  setId(value?: string) {
    this._id = value ?? undefined;
    return this;
  }

  private _clientId?: string;
  get clientId() {
    return this._clientId;
  }
  setClientId(value?: string) {
    this._clientId = value ?? undefined;
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
