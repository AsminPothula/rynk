import { DevApiKeyPermissionsType } from '@types';

export class FindDevApiKeySpecs {
  private _id?: string;

  get id() {
    return this._id;
  }

  setId(value: string) {
    this._id = value;
    return this;
  }

  private _hashedApiKey?: string;

  get hashedApiKey() {
    return this._hashedApiKey;
  }

  setHashedApiKey(value: string) {
    this._hashedApiKey = value;
    return this;
  }

  private _hmacId?: string;

  get hmacId() {
    return this._hmacId;
  }

  setHmacId(value: string) {
    this._hmacId = value;
    return this;
  }

  private _shouldIncludeDeleted = false;

  get shouldIncludeDeleted() {
    return this._shouldIncludeDeleted;
  }

  includeDeleted = () => {
    this._shouldIncludeDeleted = true;
    return this;
  };
}

export class DevApiKey {
  private constructor(
    private _id: string,
    private _hashedApiKey: string,
    private _hmacId: string,
    private _assignedTo: string,
    private _isAdmin: boolean,
    private _permissions: DevApiKeyPermissionsType[],
    private _updatedAt?: Date,
    private _createdAt?: Date,
    private _deletedAt?: Date | null,
  ) {}

  static create(params: {
    id: string;
    hashedApiKey: string;
    hmacId: string;
    assignedTo: string;
    isAdmin: boolean;
    permissions: DevApiKeyPermissionsType[];
    updatedAt?: Date;
    createdAt?: Date;
    deletedAt?: Date | null;
  }) {
    const {
      id,
      hashedApiKey,
      hmacId,
      assignedTo,
      isAdmin,
      permissions,
      updatedAt,
      createdAt,
      deletedAt,
    } = params;
    return new DevApiKey(
      id,
      hashedApiKey,
      hmacId,
      assignedTo,
      isAdmin,
      permissions,
      updatedAt,
      createdAt,
      deletedAt,
    );
  }

  get id() {
    return this._id;
  }

  get hashedApiKey() {
    return this._hashedApiKey;
  }

  get hmacId() {
    return this._hmacId;
  }

  get assignedTo() {
    return this._assignedTo;
  }

  get isAdmin() {
    return this._isAdmin;
  }

  get permissions() {
    return this._permissions;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  setDeletedAt = (value: Date | null) => {
    this._deletedAt = value;
    return this;
  };

  delete() {
    this._deletedAt = new Date();
  }
}
