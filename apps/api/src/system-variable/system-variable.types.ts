import { randomUUID } from 'crypto';

export class FindSystemVariableSpecs {
  private _id?: string;

  get id() {
    return this._id;
  }

  setId(id?: string) {
    this._id = id ?? undefined;
    return this;
  }

  private _name?: SystemVariableType;

  get name() {
    return this._name;
  }

  setName(name?: SystemVariableType) {
    this._name = name ?? undefined;
    return this;
  }

  private _limit = 20;

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

export class SystemVariable {
  constructor(
    private _id: string,
    private _name: string,
    private _value: string,
  ) {}

  static create(params: { id?: string; name: string; value: string }) {
    const { id, name, value } = params;
    return new SystemVariable(id || randomUUID(), name, value);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  setValue(value: string) {
    this._value = value;
    return this;
  }
}

export enum SystemVariableType {
  RegionalDirectorEmail = 'regional_director_email',
}
