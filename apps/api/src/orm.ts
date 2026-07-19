/* eslint-disable import/no-unresolved */

import { DataSource } from 'typeorm';
import { AuthPersistence } from './shared/database/persistence/auth.persistence';
import { ClientPersistence } from './shared/database/persistence/client.persistence';
import { RunPersistence } from './shared/database/persistence/run.persistence';
import { CronJobLockPersistence } from './shared/database/persistence/cron-job-lock.persistence';
import { CronJobPersistence } from './shared/database/persistence/cron-job.persistence';
import { DevApiKeyPersistence } from './shared/database/persistence/dev-api-key.peristence';
import { SystemVariablePersistence } from './shared/database/persistence/system-variable.persistence';
import { UserRolePersistence } from './shared/database/persistence/user-role.persistence';
import { UserPersistence } from './shared/database/persistence/user.persistence';
import { Config } from './utils/config';

export const AppDataSource = new DataSource({
  type: Config.Database.Type as any,
  host: Config.Database.Host,
  port: Config.Database.Port,
  username: Config.Database.Username,
  password: Config.Database.Password,
  database: Config.Database.Name,
  entities: [
    UserPersistence,
    CronJobPersistence,
    CronJobLockPersistence,
    AuthPersistence,
    UserRolePersistence,
    DevApiKeyPersistence,
    SystemVariablePersistence,
    ClientPersistence,
    RunPersistence,
  ],
  migrations: ['dist/**/*/migration/*.js'],
  migrationsRun: false,
  //logging: ['query'],
  // logging: ['query', 'error'],
  // cache:
  //   !process.argv.includes('migration:generate') &&
  //   !process.argv.includes('migration:revert')
  //     ? {
  //         // TODO: Not working yet
  //         type: 'ioredis/cluster',
  //         options: {
  //           startupNodes: [
  //             {
  //               host: Config.Cache.RedisHost,
  //               port: Config.Cache.RedisPort,
  //             },
  //           ],
  //         },
  //       }
  //     : undefined,
});
