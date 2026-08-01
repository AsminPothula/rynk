import { AppExceptionFilter, HttpExceptionFilter } from '@filter';
import { LoggingInterceptor } from '@interceptor';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from '@shared';

import { AuthModule } from './auth';
import { ClientModule } from './client/client.module';
import { DevApiKeyModule } from './dev-api-key/dev-api-key.module';
import { HealthModule } from './health';
import { RunModule } from './run/run.module';
import { SystemVariableModule } from './system-variable/system-variable.module';
import { UserModule } from './user';
import { CronModule } from './cron/cron.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
  imports: [
    SharedModule,
    UserModule,
    HealthModule,
    AuthModule,
    DevApiKeyModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    SystemVariableModule,
    CronModule,
    ClientModule,
    RunModule,
  ],
})
export class MainModule {}
