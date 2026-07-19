import {
  CronJobLockSetupError,
  FailedToGetResourceError,
  FailedToSaveResourceError,
} from '@error';
import { Injectable } from '@nestjs/common';
import { CronJobLockPersistence } from '@persistence/cron-job-lock.persistence';
import { CronJobLock, FindCronJobLockSpecs } from 'src/shared/cron/cron.types';
import { CronJobLockMapper } from '../mapper/cron-job-lock.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class CronJobLockRepository extends BaseRepository<CronJobLockPersistence> {
  protected model = CronJobLockPersistence;

  async save(lock: CronJobLock) {
    const persistence = CronJobLockMapper.toPersistence(lock);
    const repo = this.getDBRepository();
    try {
      const res = await repo.save(persistence);
      return CronJobLockMapper.toDomain(res);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save cron job lock',
      );
    }
  }

  async findOne(specs: FindCronJobLockSpecs) {
    const repo = this.getDBRepository();
    try {
      const persistence = await repo.findOne({
        where: {
          key: specs.key,
        },
      });
      if (!persistence) {
        return new CronJobLockSetupError();
      }
      return CronJobLockMapper.toDomain(persistence);
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get cron job lock',
      );
    }
  }
}
