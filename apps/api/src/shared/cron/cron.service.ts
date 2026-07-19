import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import ip from 'ip';
import { TransactionHelper } from '../database';
import { CronJobLockRepository } from '../database/repository/cron-job-lock.repository';
import { CronJobRepository } from '../database/repository/cron-job.repository';
import {
  CronJob,
  CronJobKey,
  CronJobLock,
  FindCronJobLockSpecs,
} from './cron.types';

@Injectable()
export class CronService {
  private readonly _logger = new LogService(CronService.name);

  constructor(
    private _repo: CronJobLockRepository,
    private _cronJobRepo: CronJobRepository,
    private _transactionHelper: TransactionHelper,
  ) {}

  async createCronJobLocks() {
    try {
      await Promise.all(
        Object.values(CronJobKey).map((key) => {
          const cronJobLock = CronJobLock.create({
            key,
            locked: false,
          });

          return this._repo.save(cronJobLock);
        }),
      );
    } catch (e) {
      this._logger.error(e);
    }
  }

  private _lockJobIfAvailable = async (key: CronJobKey) => {
    return await this._transactionHelper.start(async () => {
      const specs = new FindCronJobLockSpecs(key);
      const result = await this._repo.findOne(specs);
      if (result instanceof AppError) {
        return false;
      }
      if (!result.locked) {
        result.setLocked(true);
      } else {
        return false;
      }
      const res = await this._repo.save(result);
      if (res instanceof AppError) {
        return false;
      }
      return res.locked;
    }, 'SERIALIZABLE');
  };

  private _releaseLock = async (key: CronJobKey) => {
    return await this._transactionHelper.start(async () => {
      const specs = new FindCronJobLockSpecs(key);
      const result = await this._repo.findOne(specs);
      if (result instanceof AppError) {
        return false;
      }
      result.setLocked(false);
      const res = await this._repo.save(result);
      if (res instanceof AppError) {
        return false;
      }
      return true;
    }, 'SERIALIZABLE');
  };

  guardJob = (key: CronJobKey, userId?: string) => {
    return async (cb: () => Promise<any>) => {
      const shouldContinue = await this._lockJobIfAvailable(key);

      if (!shouldContinue) {
        return;
      }
      const started = new Date();
      this._logger.log(`${key} job started at ${started}`);
      await cb();
      const completed = new Date();
      this._logger.log(`${key} job finished at ${completed}`);

      const result = await this._releaseLock(key);
      const jobHistory = CronJob.create({
        key,
        executor: userId ? `user-${userId}` : ip.address(),
        startedAt: started,
        completedAt: completed,
      });
      await this._cronJobRepo.save(jobHistory);
      if (result) {
        this._logger.log(`Successfully released lock for ${key}`);
      } else {
        this._logger.error(new Error(`Failed to release lock for ${key}`));
      }
    };
  };

  // TODO: Add keys in CronJobKey in cron.types.ts
  // @Cron('* * * * * *', {
  //   name: 'hello world',
  //   timeZone: 'America/New_York',
  // })
  // async triggerHelloWorld() {
  //   console.log('Hello World');
  // }
}
