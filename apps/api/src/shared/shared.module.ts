import { Config } from '@config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { redisStore } from 'cache-manager-ioredis-yet';
import { RequestScopeModule } from 'nj-request-scope';
// import { RedisClientOptions } from 'redis';
import { AppDataSource } from 'src/orm';

import { CacheService } from './cache/cache.service';
import { CronService } from './cron/cron.service';
import { databaseRepositories, TransactionHelper } from './database';
import { EmailService } from './email/email.service';
import { EventService } from './event/event.service';
import { HttpService } from './http/http.service';

@Module({
  imports: [
    RequestScopeModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    HttpModule,
    JwtModule.register({}),
    CacheModule.register({
      isGlobal: true,
      ttl: Config.Cache.DefaultCacheDuration,

      // useFactory: async () => {
      //   const store = (await redisStore({
      //     clusterConfig: {
      //       nodes: [
      //         {
      //           host: Config.Cache.RedisHost,
      //           port: Config.Cache.RedisPort,
      //         },
      //       ],
      //       options: {
      //         slotsRefreshTimeout: 5000,
      //         dnsLookup: (address, callback) => callback(null, address),
      //       },
      //     },
      //     tls: {},
      //     retryStrategy: (times) => {
      //       const ms = Math.min(100 * times, 2000);
      //       console.log(`Cluster retry #${times}: Will wait ${ms} ms`);
      //       return ms;
      //     },
      //     password: '',
      //     ttl: Config.Cache.DefaultCacheDuration * 1000,
      //   })) as any;
      //   return {
      //     store,
      //   };
      // },
    }),
  ],
  providers: [
    ...databaseRepositories,
    TransactionHelper,
    CronService,
    EventService,
    EmailService,
    CacheService,
    HttpService,
  ],
  exports: [
    ...databaseRepositories,
    TransactionHelper,
    EventService,
    CronService,
    EmailService,
    CacheService,
    HttpService,
  ],
})
export class SharedModule {}
