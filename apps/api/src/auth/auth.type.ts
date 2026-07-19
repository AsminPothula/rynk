import { Config } from '@config';
import { User } from '@user/types';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import {
  AuthNotActiveError,
  EmailNotVerifiedError,
  PasswordTokenExpiredError,
  PasswordTokenNotFoundError,
  SameAsOneOfPreviousPasswordsError,
  UserNotGuestCannotResetPasswordError,
  WrongPasswordError,
} from './auth.error';

export class FindAuthSpecs {
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

  private _userEmail?: string;

  get userEmail() {
    return this._userEmail;
  }

  setUserEmail(value: string) {
    this._userEmail = value;
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

  private _passwordToken?: string;

  get passwordToken() {
    return this._passwordToken;
  }

  setPasswordToken(value: string) {
    this._passwordToken = value;
    return this;
  }
}

export class Auth {
  constructor(
    private _id: string,
    private _password: string,
    private _passwordChangedAt: Date | null,
    private _oldPasswords: string[],
    private _user: User,
    private _deactivatedAt: Date | null,
    private _passwordToken: string | null,
    private _passwordTokenIssuedAt: Date | null,
  ) {}

  static create(params: {
    id: string;
    password: string;
    passwordChangedAt: Date | null;
    oldPasswords: string[];
    user: User;
    deactivatedAt: Date | null;
    passwordToken: string | null;
    passwordTokenIssuedAt: Date | null;
  }) {
    const {
      id,
      password,
      passwordChangedAt,
      oldPasswords,
      user,
      deactivatedAt,
      passwordToken,
      passwordTokenIssuedAt,
    } = params;
    return new Auth(
      id,
      password,
      passwordChangedAt,
      oldPasswords,
      user,
      deactivatedAt,
      passwordToken,
      passwordTokenIssuedAt,
    );
  }

  static hashPassword = async (value: string) => {
    const salt = await bcrypt.genSalt(Config.Auth.PasswordSaltRound);
    return bcrypt.hash(value, salt);
  };

  hasPassword = async (value: string) => {
    return Auth.comparePassword(value, this._password);
  };

  static comparePassword = async (password: string, hashedPassword: string) =>
    bcrypt.compare(password, hashedPassword);

  static async createNewLoginWithPassword(params: {
    password: string;
    user: User;
  }) {
    const { password, user } = params;
    const hashedPassword = await Auth.hashPassword(password);
    return Auth.create({
      id: randomUUID(),
      password: hashedPassword,
      passwordChangedAt: new Date(),
      oldPasswords: [],
      user,
      deactivatedAt: null,
      passwordToken: null,
      passwordTokenIssuedAt: null,
    });
  }

  static async createNewLoginWithoutPassword(params: { user: User }) {
    const { user } = params;
    return Auth.create({
      id: randomUUID(),
      password: '',
      passwordChangedAt: null,
      oldPasswords: [],
      user,
      deactivatedAt: null,
      passwordToken: randomUUID(),
      passwordTokenIssuedAt: new Date(),
    });
  }

  setPassword = async (params: { token: string; password: string }) => {
    if (params.token !== this._passwordToken) {
      return new PasswordTokenNotFoundError();
    }
    const currentTime = dayjs();
    const tokenIssuedTime = dayjs(this._passwordTokenIssuedAt);
    const diff = currentTime.diff(tokenIssuedTime, 'minute');
    if (diff > Config.Auth.PasswordTokenExpireDurationInMinute) {
      return new PasswordTokenExpiredError();
    }
    const hashedPassword = await Auth.hashPassword(params.password);
    this._password = hashedPassword;
    this._passwordChangedAt = new Date();
    this._passwordToken = null;
    this._passwordTokenIssuedAt = null;
    return true;
  };

  createPasswordToken = async () => {
    this._passwordToken = randomUUID();
    this._passwordTokenIssuedAt = new Date();
  };

  changePassword = async (params: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const oldPasswordMatched = await this.hasPassword(params.oldPassword);
    if (!oldPasswordMatched) {
      return new WrongPasswordError();
    }
    const newOldPasswords = [...this._oldPasswords];
    newOldPasswords.unshift(this._password);
    // Remove extra items if array length is more than threshold
    newOldPasswords.splice(
      Config.Auth.OldPasswordCountThreshold,
      newOldPasswords.length - Config.Auth.OldPasswordCountThreshold,
    );
    const matchResults = await Promise.all(
      newOldPasswords.map((oldHashedPassword) =>
        Auth.comparePassword(params.newPassword, oldHashedPassword),
      ),
    );
    if (matchResults.some((result) => result)) {
      return new SameAsOneOfPreviousPasswordsError();
    }
    const hashedPassword = await Auth.hashPassword(params.newPassword);
    this._password = hashedPassword;
    // Remove extra items if array is more than threshold - 1. Current password counted as one
    newOldPasswords.splice(
      Config.Auth.OldPasswordCountThreshold - 1,
      newOldPasswords.length - Config.Auth.OldPasswordCountThreshold + 1,
    );
    this._oldPasswords = newOldPasswords;
    this._passwordChangedAt = new Date();
    return true;
  };

  checkLogin = () => {
    if (this.user.status !== 'Active') {
      return new AuthNotActiveError();
    }

    if (!this.user.isEmailVerified) {
      return new EmailNotVerifiedError();
    }

    return true;
  };

  canResetPassword = () => {
    if (this.user.status !== 'Active') {
      return new AuthNotActiveError();
    }

    if (!this.user.isGuest) {
      return new UserNotGuestCannotResetPasswordError();
    }
    return true;
  };

  get id() {
    return this._id;
  }

  get password() {
    return this._password;
  }

  get passwordChangedAt() {
    return this._passwordChangedAt;
  }

  get oldPasswords() {
    return this._oldPasswords;
  }

  get user() {
    return this._user;
  }

  get passwordToken() {
    return this._passwordToken;
  }

  get passwordTokenIssuedAt() {
    return this._passwordTokenIssuedAt;
  }

  get deactivatedAt() {
    return this._deactivatedAt;
  }

  clearPasswordToken = async () => {
    this._passwordToken = null;
    this._passwordTokenIssuedAt = null;
  };
}
