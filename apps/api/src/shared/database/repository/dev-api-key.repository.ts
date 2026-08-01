import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { DevApiKeyPersistence } from '@persistence/dev-api-key.peristence';

import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';
import { DevApiKeyNotFoundError } from 'src/dev-api-key/dev-api-key.error';
import {
  DevApiKey,
  FindDevApiKeySpecs,
} from 'src/dev-api-key/dev-api-key.type';
import { IsNull } from 'typeorm';
import { DevApiKeyMapper } from '../mapper/dev-api-key.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class DevApiKeyRepository extends BaseRepository<DevApiKeyPersistence> {
  protected model = DevApiKeyPersistence;
  private _logger = new LogService(DevApiKeyRepository.name);

  async save(DevApiKey: DevApiKey) {
    const persistence = DevApiKeyMapper.toPersistence(DevApiKey);
    const repo = this.getDBRepository();
    try {
      const savedDevApiKey = await repo.save(persistence);
      return DevApiKeyMapper.toDomain(savedDevApiKey);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save dev api key',
      );
    }
  }

  async findOne(specs: FindDevApiKeySpecs) {
    const repo = this.getDBRepository();
    try {
      const persistence = await repo.findOne({
        where: {
          hmacId: specs.hmacId ?? undefined,
          id: specs.id ?? undefined,
          hashedApiKey: specs.hashedApiKey ?? undefined,
          deletedAt: specs.shouldIncludeDeleted ? undefined : IsNull(),
        },
      });
      if (!persistence) {
        return new DevApiKeyNotFoundError();
      }
      return DevApiKeyMapper.toDomain(persistence);
    } catch (e) {
      this._logger.error(e);
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get dev api key',
      );
    }
  }
}
