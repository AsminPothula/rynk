import { AuthRepository } from './repository/auth.repository';
import { ClientRepository } from './repository/client.repository';
import { CronJobLockRepository } from './repository/cron-job-lock.repository';
import { CronJobRepository } from './repository/cron-job.repository';
import { DevApiKeyRepository } from './repository/dev-api-key.repository';
import { RunRepository } from './repository/run.repository';
import { SystemVariableRepository } from './repository/system-variable.repository';
import { UserRoleRepository } from './repository/user-role.repository';
import { UserRepository } from './repository/user.repository';

export const databaseRepositories = [
  AuthRepository,
  CronJobRepository,
  CronJobLockRepository,
  UserRepository,
  UserRoleRepository,
  DevApiKeyRepository,
  SystemVariableRepository,
  ClientRepository,
  RunRepository,
];

export * from './helper';
export {
  AuthRepository,
  ClientRepository,
  CronJobLockRepository,
  CronJobRepository,
  DevApiKeyRepository,
  RunRepository,
  SystemVariableRepository,
  UserRepository,
  UserRoleRepository,
};
