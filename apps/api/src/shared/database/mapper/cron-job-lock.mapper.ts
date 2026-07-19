import { CronJobLockPersistence } from '@persistence/cron-job-lock.persistence';
import { CronJobLock } from 'src/shared/cron/cron.types';
export class CronJobLockMapper {
  static toDomain(data: CronJobLockPersistence): CronJobLock {
    return CronJobLock.create({
      id: data.id,
      key: data.key,
      locked: data.locked,
    });
  }

  static toPersistence(data: CronJobLock): CronJobLockPersistence {
    const cronJobLock = new CronJobLockPersistence();
    Object.assign(cronJobLock, {
      id: data.id,
      key: data.key,
      locked: data.locked,
    });
    return cronJobLock;
  }
}
