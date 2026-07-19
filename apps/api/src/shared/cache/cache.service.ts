import { Config } from '@config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

type AcceptableCacheValue =
  | string
  | number
  | boolean
  | {
      [key: string]: AcceptableCacheValue;
    }
  | AcceptableCacheValue[];

// FIXME: Need to inject this instead?
export const CacheKey = {
  AccessTokenBlacklistTimestamp: (userId: string) =>
    `AccessTokenBlacklistTimestamp:${userId}`,
  RefreshTokenBlacklistTimestamp: (userId: string) =>
    `RefreshTokenBlacklistTimestamp:${userId}`,
};

@Injectable()
export class CacheService {
  @Inject(CACHE_MANAGER) private _cacheManager: Cache;

  set = async (
    key: string,
    value: AcceptableCacheValue,
    ttlInSecond: number = Config.Cache.DefaultCacheDuration,
  ) => {
    await this._cacheManager.set(
      `${Config.Server.Env}:${key}`,
      value,
      ttlInSecond * 1000,
    );
  };

  get = async <T extends AcceptableCacheValue>(
    key: string,
  ): Promise<T | null> => {
    return (
      (await this._cacheManager.get<T>(`${Config.Server.Env}:${key}`)) || null
    );
  };

  delete = async (key: string) => {
    return await this._cacheManager.del(`${Config.Server.Env}:${key}`);
  };
}
