import { Config } from '@config';
import { METADATA } from '@constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { CacheKey, CacheService } from '@shared';
import {
  AppError,
  UserPermission,
  UserProfileRole,
  UserProfileRoleType,
} from '@types';
import { AuthDetail } from '@user/types';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const auth = await this.authService.validateCredential(email, password);
    if (auth instanceof AppError) {
      throw auth;
    }
    return auth;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(private _cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.Auth.JwtSecret,
    });
  }

  async validate(payload: any): Promise<AuthDetail> {
    const accessTokenBlockedBeforeTimestamp =
      await this._cacheService.get<number>(
        CacheKey.AccessTokenBlacklistTimestamp(payload.sub),
      );
    if (
      accessTokenBlockedBeforeTimestamp &&
      accessTokenBlockedBeforeTimestamp / 1000 > payload.iat
    ) {
      throw new UnauthorizedException();
    }

    return new AuthDetail({
      userId: payload.sub,
      roles: payload.roles,
      status: payload.status,
      permissionList: payload.permissionList,
    });
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class AuthenticatedGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const permission = this.reflector.get<UserPermission>(
      METADATA.PERMISSION,
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const decodedJwt: AuthDetail = request.user;
    const permissionList = new Set(decodedJwt.permissionList);

    return permissionList.has(permission as UserPermission);
  }
}

// @Injectable()
// export class RoleGuard implements CanActivate {
//   constructor(private reflector: Reflector, private roleService: RoleService) {}

//   async canActivate(context: ExecutionContext) {
//     const apiAllowedRole = this.reflector.get<UserRole>(
//       METADATA.ROLE,
//       context.getHandler(),
//     );

//     if (!apiAllowedRole) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const decodedJwt: AuthDetail = request.user;
//     const loggedInUserRole = await this.roleService.fetchUserRoleById(
//       decodedJwt.roleId,
//     );
//     if (loggedInUserRole instanceof AppError) {
//       return false;
//     }
//     const { role: userRole } = loggedInUserRole;
//     return Object.values(apiAllowedRole).includes(userRole);
//   }
// }

export const SignInEndpoint = () => applyDecorators(UseGuards(LocalAuthGuard));

export const SignedInAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// TODO: Add logic to implement multiple roles
export const getMappedRoles = (userRole: UserProfileRoleType) => {
  return UserProfileRole.SystemAdmin;
};
