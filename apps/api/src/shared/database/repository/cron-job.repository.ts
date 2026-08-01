import { FailedToSaveResourceError } from '@error';
import { Injectable } from '@nestjs/common';
import { CronJobPersistence } from '@persistence/cron-job.persistence';
import { CronJob } from 'src/shared/cron/cron.types';
import { CronJobMapper } from '../mapper/cron-job.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class CronJobRepository extends BaseRepository<CronJobPersistence> {
  protected model = CronJobPersistence;

  async save(lock: CronJob) {
    const persistence = CronJobMapper.toPersistence(lock);
    const repo = this.getDBRepository();
    try {
      const res = await repo.save(persistence);
      return CronJobMapper.toDomain(res);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save cron job',
      );
    }
  }
}
