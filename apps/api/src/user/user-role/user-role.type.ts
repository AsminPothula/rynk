import { UserProfileRoleType } from '@types';
import { randomUUID } from 'crypto';
import { User } from '../user.type';

export class FindUserRoleSpecs {
  private _userId?: string;

  get userId() {
    return this._userId;
  }

  setUserId(value: string) {
    this._userId = value;
    return this;
  }
  private _userIdList?: string[];

  get userIdList() {
    return this._userIdList;
  }

  setUserIdList(value: string[]) {
    this._userIdList = value;
    return this;
  }

  private _role?: UserProfileRoleType;

  get role() {
    return this._role;
  }

  setRole(value: UserProfileRoleType) {
    this._role = value;
    return this;
  }
  private _roleList?: UserProfileRoleType[];

  get roleList() {
    return this._roleList;
  }

  setRoleList(value: UserProfileRoleType[]) {
    this._roleList = value;
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

export class UserRole {
  // Don't use this
  private constructor(
    private _id: string,
    private _userId: string,
    private _role: UserProfileRoleType,
    private _user?: User,
    private _createdAt?: Date,
    private _updatedAt?: Date,
    private _deletedAt?: Date | null,
  ) {}

  static createUserRole(params: { userId: string; role: UserProfileRoleType }) {
    const { userId, role } = params;
    return UserRole.create({
      id: randomUUID(),
      userId,
      role,
    });
  }

  static createUserRoles(params: {
    userId: string;
    roleList: UserProfileRoleType[];
  }) {
    const { userId, roleList } = params;
    const roles: UserRole[] = [];
    roleList.forEach((role) => {
      roles.push(
        this.createUserRole({
          userId,
          role,
        }),
      );
    });
    return roles;
  }

  static create(params: {
    id: string;
    userId: string;
    role: UserProfileRoleType;
    user?: User;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    const { id, userId, role, user, createdAt, updatedAt, deletedAt } = params;
    return new UserRole(
      id,
      userId,
      role,
      user,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get role() {
    return this._role;
  }

  get user() {
    return this._user;
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

  delete() {
    this._deletedAt = new Date();
    return this;
  }
}
