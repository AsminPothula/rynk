import { randomUUID } from 'crypto';

export enum CronJobKey {
  HelloWorld = 'Hello World',
}

export class FindCronJobLockSpecs {
  constructor(private _key: CronJobKey) {}

  get key() {
    return this._key;
  }
}

export class CronJobLock {
  constructor(
    private _id: string,
    private _key: string,
    private _locked: boolean,
  ) {}

  static create(params: { id?: string; key: string; locked: boolean }) {
    const { id = randomUUID(), key, locked } = params;
    return new CronJobLock(id, key, locked);
  }

  get id() {
    return this._id;
  }

  get key() {
    return this._key;
  }

  get locked() {
    return this._locked;
  }

  setLocked(locked: boolean) {
    this._locked = locked;
  }
}

export class CronJob {
  constructor(
    private _id: string,
    private _key: string,
    private _executor: string,
    private _startedAt: Date,
    private _completedAt: Date,
  ) {}

  static create(params: {
    id?: string;
    key: string;
    executor: string;
    startedAt: Date;
    completedAt: Date;
  }) {
    const { id = randomUUID(), key, executor, startedAt, completedAt } = params;
    return new CronJob(id, key, executor, startedAt, completedAt);
  }

  get id() {
    return this._id;
  }

  get key() {
    return this._key;
  }

  get executor() {
    return this._executor;
  }

  get startedAt() {
    return this._startedAt;
  }

  get completedAt() {
    return this._completedAt;
  }
}
