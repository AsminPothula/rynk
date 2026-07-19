import {
  SignUpMode,
  SignUpModeType,
  UserPermission,
  UserProfileRoleType,
  UserSearchStatus,
} from '@types';
import { randomUUID } from 'crypto';
import { UserRole } from './user-role/user-role.type';
import {
  CannotDeactivateDeactivatedUserError,
  CannotDeactivateInactiveUserError,
  CannotDeactivateInvitedUserError,
  CannotReactivateActiveUserError,
  CannotReactivateInactiveUserError,
  CannotReactivateInvitedUserError,
  UserIsNotEligibleForInvitationError,
  UserNotActiveError,
} from './user.error';

import { Config } from '@config';
import moment from 'moment';
export class FindUserSpecs {
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

  private _email?: string;

  get email() {
    return this._email;
  }

  setEmail(value: string) {
    this._email = value;
    return this;
  }

  private _password?: string;

  get password() {
    return this._password;
  }

  setPassword(value: string) {
    this._password = value;
    return this;
  }

  private _status?: UserStatusType;

  get status() {
    return this._status;
  }

  setStatus(value: UserStatusType) {
    this._status = value;
    return this;
  }

  private _phone?: string;

  get phone() {
    return this._phone;
  }

  setPhone(value: string) {
    this._phone = value;
    return this;
  }

  private _roleList?: string[];

  get roleList() {
    return this._roleList;
  }

  setRoleList(value: string[]) {
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

  private _shouldIncludeDeleted = false;

  get shouldIncludeDeleted() {
    return this._shouldIncludeDeleted;
  }

  includeDeleted = () => {
    this._shouldIncludeDeleted = true;
    return this;
  };

  private _searchTxt?: string;

  get searchTxt() {
    return this._searchTxt;
  }

  setSearchTxt(value: string) {
    this._searchTxt = value;
    return this;
  }

  private _statusList?: ('Active' | 'Deactivated' | 'Invited' | 'Inactive')[];

  get statusList() {
    return this._statusList;
  }

  setStatusList(value?: UserSearchStatus) {
    if (value === UserSearchStatus.Active) {
      this._statusList = ['Active'];
    } else if (value === UserSearchStatus.Inactive) {
      this._statusList = ['Inactive'];
    } else if (value === UserSearchStatus.Deactivated) {
      this._statusList = ['Deactivated'];
    } else if (value === UserSearchStatus.Invited) {
      this._statusList = ['Invited'];
    } else {
      this._statusList = ['Active', 'Inactive', 'Deactivated', 'Invited'];
    }
    return this;
  }

  setUserStatusList(value?: UserStatusType[]) {
    this._statusList = value;
    return this;
  }
}

export enum UserStatus {
  Active = 'Active',
  Deactivated = 'Deactivated',
  Inactive = 'Inactive', // Was added to system but no action has been performed on the account
  Invited = 'Invited', // Added and invited to create an account. No password set
}

export type UpdatableUserStatusType = 'Active' | 'Deactivated';

export type UserStatusType = `${UserStatus}`;

export const userStatusList = Object.freeze([
  UserStatus.Active,
  UserStatus.Deactivated,
  UserStatus.Inactive,
  UserStatus.Invited,
]);

export class AuthDetail {
  readonly userId: string;
  readonly roles: UserProfileRoleType[];
  readonly status: UserStatusType;
  readonly permissionList: UserPermission[];

  constructor(params: {
    userId: string;
    roles: UserProfileRoleType[];
    status: UserStatusType;
    permissionList: UserPermission[];
  }) {
    this.userId = params.userId;
    this.roles = params.roles;
    this.status = params.status;
    this.permissionList = params.permissionList;
  }
}
export class User {
  // Don't use this
  private constructor(
    private _id: string,
    private _firstName: string,
    private _lastName: string,
    private _email: string,
    private _phone: string | null,
    private _status: UserStatusType,
    private _statusChangedAt: Date,
    private _isEmailVerified: boolean,
    private _verificationEmailLastSent: Date | null,
    private _signUpMode: SignUpModeType,
    private _isGuest: boolean,
    private _deactivatedAt?: Date | null,
    private _roles?: UserRole[],
    private _updatedAt?: Date,
    private _createdAt?: Date,
    private _deletedAt?: Date | null,
  ) {}

  static async createNewUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    signUpMode: SignUpModeType;
    isGuest: boolean;
  }) {
    const { firstName, lastName, email, phone, signUpMode, isGuest } = params;
    const time = new Date();

    return User.create({
      id: randomUUID(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      status: UserStatus.Active,
      statusChangedAt: time,
      createdAt: time,
      updatedAt: time,
      deletedAt: null,
      isEmailVerified: signUpMode === SignUpMode.Guest ? false : true,
      verificationEmailLastSent: signUpMode === SignUpMode.Guest ? time : null,
      signUpMode,
      isGuest,
    });
  }

  static create(params: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: UserStatusType;
    statusChangedAt: Date;
    isEmailVerified: boolean;
    verificationEmailLastSent: Date | null;
    signUpMode: SignUpModeType;
    isGuest: boolean;
    roles?: UserRole[];
    deactivatedAt?: Date | null;
    updatedAt?: Date;
    createdAt?: Date;
    deletedAt?: Date | null;
  }) {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      roles,
      status,
      statusChangedAt,
      deactivatedAt,
      isEmailVerified,
      verificationEmailLastSent,
      signUpMode,
      isGuest,
      updatedAt,
      createdAt,
      deletedAt,
    } = params;
    return new User(
      id,
      firstName,
      lastName,
      email,
      phone,
      status,
      statusChangedAt,
      isEmailVerified,
      verificationEmailLastSent,
      signUpMode,
      isGuest,
      deactivatedAt,
      roles,
      updatedAt,
      createdAt,
      deletedAt,
    );
  }

  // static createUser(params: {
  //   id: string;
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   phone: string;
  //   roleId: string;
  //   status: UserStatusType;
  //   statusChangedAt: Date;
  //   updatedAt: Date;
  //   createdAt: Date;
  //   deletedAt: Date | null;
  //   deactivatedAt?: Date | null;
  // }) {
  //   const {
  //     id,
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     roleId,
  //     status,
  //     statusChangedAt,
  //     updatedAt,
  //     createdAt,
  //     deletedAt,
  //     deactivatedAt,
  //   } = params;
  //   return new User(
  //     id,
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     roleId,
  //     status,
  //     statusChangedAt,
  //     updatedAt,
  //     createdAt,
  //     deletedAt,
  //     deactivatedAt,
  //   );
  // }

  get id() {
    return this._id;
  }

  get firstName() {
    return this._firstName;
  }

  setFirstName = (value: string) => {
    this._firstName = value;
    return this;
  };

  get phone() {
    return this._phone;
  }

  setPhone = (value: string | null) => {
    this._phone = value;
    return this;
  };

  get lastName() {
    return this._lastName;
  }

  setLastName = (value: string) => {
    this._lastName = value;
    return this;
  };

  get email() {
    return this._email;
  }

  get status() {
    return this._status;
  }

  get statusChangedAt() {
    return this._statusChangedAt;
  }

  updateStatus = (status: UserStatusType) => {
    if (this.status !== status) {
      this._status = status;
      this._statusChangedAt = new Date();
    }
  };

  setRoles = (value: UserRole[]) => {
    this._roles = value;
    return this;
  };

  get roles() {
    return this._roles;
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

  get deactivatedAt() {
    return this._deactivatedAt;
  }

  setDeactivatedAt = (value: Date | null) => {
    this._deactivatedAt = value;
    return this;
  };

  static async createSystemAdmin(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    const { firstName, lastName, email, phone } = params;
    const time = new Date();
    return User.create({
      id: randomUUID(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      status: UserStatus.Active,
      statusChangedAt: time,
      createdAt: time,
      updatedAt: time,
      deletedAt: null,
      isEmailVerified: false,
      verificationEmailLastSent: time,
      signUpMode: SignUpMode.Guest,
      isGuest: false,
      deactivatedAt: null,
    });
  }

  completeOnboarding() {
    this._status = UserStatus.Active;
    this._statusChangedAt = new Date();
  }

  isPendingOnboard() {
    return (
      this._status === UserStatus.Inactive ||
      this._status === UserStatus.Invited
    );
  }

  updateMyProfile(value: {
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    if (this._status !== UserStatus.Active) {
      return new UserNotActiveError();
    }
    const { firstName, lastName, phone } = value;
    this.setFirstName(firstName).setLastName(lastName).setPhone(phone);
    return true;
  }

  deactivate = (user: User) => {
    if (user.status === 'Deactivated') {
      return new CannotDeactivateDeactivatedUserError();
    }
    if (user.status === 'Inactive') {
      return new CannotDeactivateInactiveUserError();
    }
    if (user.status === 'Invited') {
      return new CannotDeactivateInvitedUserError();
    }
    // Set Deactivated status & date
    user.updateStatus('Deactivated');
    user.setDeactivatedAt(new Date());
    return true;
  };

  reactivate = (user: User) => {
    if (user.status === 'Active') {
      return new CannotReactivateActiveUserError();
    }
    if (user.status === 'Inactive') {
      return new CannotReactivateInactiveUserError();
    }
    if (user.status === 'Invited') {
      return new CannotReactivateInvitedUserError();
    }
    // Set Active status & deactivated date to null
    user.updateStatus('Active');
    user.setDeactivatedAt(null);
    return true;
  };

  delete() {
    this._deletedAt = new Date();
  }

  invite() {
    if (this.isPendingOnboard()) {
      return new UserIsNotEligibleForInvitationError();
    }
    this.updateStatus(UserStatus.Invited);
    return true;
  }

  get isEmailVerified() {
    return this._isEmailVerified;
  }

  setEmailVerified = (value: boolean) => {
    this._isEmailVerified = value;
    return this;
  };

  get verificationEmailLastSent() {
    return this._verificationEmailLastSent;
  }

  setVerificationEmailLastSent = (value: Date | null) => {
    this._verificationEmailLastSent = value;
    return this;
  };

  get isGuest() {
    return this._isGuest;
  }

  setGuest = (value: boolean) => {
    this._isGuest = value;
    return this;
  };

  get signUpMode() {
    return this._signUpMode;
  }

  canResendEmailVerification() {
    if (!this.verificationEmailLastSent) {
      return true;
    }
    const givenDate = moment(this.verificationEmailLastSent);
    const currentDate = moment();
    const differenceInMinutes = currentDate.diff(givenDate, 'minutes');

    return (
      differenceInMinutes >=
      Config.Auth.ResendEmailVerificationTokenDelayInMinutes
    );
  }

  isAlreadyVerified() {
    return this.isEmailVerified || this.signUpMode === SignUpMode.Guest;
  }
}
