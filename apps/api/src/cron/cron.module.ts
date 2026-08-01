import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { DevApiKeyModule } from 'src/dev-api-key/dev-api-key.module';
import { CronService } from 'src/shared/cron/cron.service';
import { CronController } from './cron.controller';

@Module({
  imports: [SharedModule, DevApiKeyModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
