import { Config } from '@config';
import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { AppError, DevApiKeyPermissionsType } from '@types';
import { randomUUID } from 'crypto';
import { DevApiKeyRepository } from 'src/shared/database/repository/dev-api-key.repository';
import { DevApiKeyHelper } from './dev-api-key.helper';
import { DevApiKey, FindDevApiKeySpecs } from './dev-api-key.type';

@Injectable()
export class DevApiKeyService {
  private _logger = new LogService(DevApiKeyService.name);
  private secret = Config.DevApi.DevApiKeySecret;

  constructor(
    private _devApiKeyRepository: DevApiKeyRepository,
    private _devApiKeyHelper: DevApiKeyHelper,
  ) {}

  findOne = async (specs: FindDevApiKeySpecs) => {
    return await this._devApiKeyRepository.findOne(specs);
  };

  private _findByUnhashedApiKey = async (apiKey: string) => {
    const hmacId = this.getHmacId(apiKey);
    const devApiSpecs = new FindDevApiKeySpecs().setHmacId(hmacId);
    const devApiKey = await this.findOne(devApiSpecs);
    return devApiKey;
  };

  findAndVerifyWithUnhashedApiKey = async ({ apiKey }: { apiKey: string }) => {
    const devApiKey = await this._findByUnhashedApiKey(apiKey);

    if (!devApiKey) {
      return { isMatch: false, devApiKey: null };
    }
    if (devApiKey instanceof AppError) {
      return { isMatch: false, devApiKey: null };
    }
    const isMatch = await this._devApiKeyHelper.compareHash(
      apiKey,
      devApiKey.hashedApiKey,
    );
    return { isMatch, devApiKey };
  };

  create = async ({
    assignedTo,
    apiKey,
    permissions,
  }: {
    assignedTo: string;
    apiKey?: string;
    permissions: DevApiKeyPermissionsType[];
  }) => {
    const {
      hmacIdentifier,
      hashedApiKey,
      apiKey: myApiKey,
    } = await this._devApiKeyHelper.generateHashAndHmac({
      secret: this.secret,
      apiKey,
    });

    const newKeyData = DevApiKey.create({
      id: randomUUID(),
      hmacId: hmacIdentifier,
      hashedApiKey,
      assignedTo,
      permissions,
      isAdmin: false,
    });

    const keyInfo = await this._devApiKeyRepository.save(newKeyData);
    return {
      keyInfo,
      savedApiKey: myApiKey, // NOTE: save for later
    };
  };

  getHmacId = (providedApiKey: string) => {
    const hmacIdentifier = this._devApiKeyHelper.createHmacIdentifier(
      providedApiKey,
      this.secret,
    );
    return hmacIdentifier;
  };
}
