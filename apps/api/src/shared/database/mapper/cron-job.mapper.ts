import { CronJobPersistence } from '@persistence/cron-job.persistence';
import { CronJob } from 'src/shared/cron/cron.types';
export class CronJobMapper {
  static toDomain(data: CronJobPersistence): CronJob {
    return CronJob.create({
      id: data.id,
      key: data.key,
      completedAt: data.completedAt,
      startedAt: data.startedAt,
      executor: data.executor,
    });
  }

  static toPersistence(data: CronJob): CronJobPersistence {
    const cronJobLock = new CronJobPersistence();
    Object.assign(cronJobLock, {
      id: data.id,
      key: data.key,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      executor: data.executor,
    });
    return cronJobLock;
  }
}
