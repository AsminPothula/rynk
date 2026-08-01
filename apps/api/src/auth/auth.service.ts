import { Config } from '@config';
import { OnDomainEvent } from '@decorator';
import { DomainEvent } from '@events';
import { getUserPermissions } from '@helper';
import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '@shared';
import { AppError } from '@types';
import { AuthDetail, User } from '@user/types';
import { AuthNotFoundError, InvalidPasswordError } from './auth.error';
import { Auth, FindAuthSpecs } from './auth.type';

@Injectable()
export class AuthService {
  private readonly _logger = new LogService(AuthService.name);

  constructor(
    private _authRepo: AuthRepository,
    private _jwtService: JwtService,
  ) {}

  getPortalUrlFor = (auth: Auth) => {
    return auth.id + 'unset url';
  };

  find = async (specs: FindAuthSpecs) => {
    const getResult = await this._authRepo.findOne(specs);
    if (!getResult) {
      return new AuthNotFoundError();
    }
    return getResult;
  };

  save = async (auth: Auth) => {
    const saveResult = await this._authRepo.save(auth);
    return saveResult;
  };

  async delete(spec: FindAuthSpecs) {
    const getResult = await this._authRepo.delete(spec);
    return getResult;
  }

  async validateCredential(email: string, password: string) {
    const auth = await this.find(new FindAuthSpecs().setUserEmail(email));
    if (auth instanceof AppError) {
      return new AuthNotFoundError();
    }
    const validPassword = await auth.hasPassword(password);
    if (validPassword) {
      return auth;
    }
    return new InvalidPasswordError();
  }

  generateAccessToken = async (payload: AuthDetail) => {
    const { userId, ...rest } = payload;
    return await this._jwtService.signAsync(
      {
        ...rest,
        sub: userId,
      },
      {
        expiresIn: Config.Auth.AccessTokenExpireDurationInHour * 60 * 60,
      },
    );
  };

  _login = async (auth: Auth) => {
    const user = auth.user;
    const userRoles = (user.roles || [])
      .filter((ele) => ele.deletedAt === null)
      .map((ele) => ele.role);
    const userPermissions = getUserPermissions(userRoles);

    const accessToken = await this.generateAccessToken(
      new AuthDetail({
        userId: user.id,
        permissionList: userPermissions,
        status: user.status,
        roles: userRoles,
      }),
    );
    const refreshToken = await this._jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: Config.Auth.RefreshTokenExpireDurationInHour * 60 * 60,
      },
    );
    this._logger.log(`Logging in user: ${user.id}`);
    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  };

  public _sfLogin = async (user: User) => {
    const userRoles = (user.roles || [])
      .filter((ele) => ele.deletedAt === null)
      .map((ele) => ele.role);

    const userPermissions = getUserPermissions(userRoles);
    const accessToken = await this.generateAccessToken(
      new AuthDetail({
        userId: user.id,
        permissionList: userPermissions,
        status: user.status,
        roles: userRoles,
      }),
    );
    const refreshToken = await this._jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: Config.Auth.RefreshTokenExpireDurationInHour * 60 * 60,
      },
    );
    this._logger.log(`Logging in user: ${user.id}`);
    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  };

  @OnDomainEvent(DomainEvent.DeleteUserAuth)
  async deleteAuthUser(params: { userIds: string[] }) {
    const { userIds } = params;
    const specs = new FindAuthSpecs().setUserIdList(userIds);
    // Hard delete user auth
    return await this.delete(specs);
  }

  generateEmailVerificationToken = async ({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }) => {
    return await this._jwtService.signAsync(
      {
        email,
        sub: userId,
      },
      {
        expiresIn:
          Config.Auth.EmailVerificationTokenExpireDurationInHour * 60 * 60,
      },
    );
  };

  verifyEmailVerificationToken = async (token: string) => {
    return await this._jwtService.verifyAsync(token);
  };
}
