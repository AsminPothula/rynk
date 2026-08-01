import {
  applyDecorators,
  createParamDecorator,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';

import { DevApiKeyPermissionsType } from '@types';

import { Config } from '@config';
import { METADATA } from '@constant';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DevApiKeyService } from './dev-api-key.service';

@Injectable()
export class DevApiKeyPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private _devApiKeyService: DevApiKeyService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.get<DevApiKeyPermissionsType[]>(
      METADATA.DEV_API_PERMISSION,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const requestKey: string = (
      request.headers[Config.DevApi.DevApiKeyHeaderName] || ''
    ).trim();

    if (!requestKey) {
      throw new UnauthorizedException('Invalid server key');
    }

    const { isMatch: isValidApiKey, devApiKey: developer } =
      await this._devApiKeyService.findAndVerifyWithUnhashedApiKey({
        apiKey: requestKey,
      });

    if (!isValidApiKey || !developer) {
      throw new UnauthorizedException('Invalid server key');
    }

    if (!developer) {
      return false;
    }

    return (
      developer.isAdmin ||
      requiredPermissions.some((permission) =>
        developer.permissions.includes(permission),
      )
    );
  }
}

export const HasDevApiKeyPermissions = (
  permissions: DevApiKeyPermissionsType[],
) => SetMetadata(METADATA.DEV_API_PERMISSION, permissions); // FIXME

export const DeveloperApiKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.developerApiKey;
  },
);

export const DeveloperApiKeyPermissionsGuard = () =>
  applyDecorators(UseGuards(DevApiKeyPermissionsGuard));
