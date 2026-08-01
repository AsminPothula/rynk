import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { DevApiKeyController } from './dev-api-key.controller';
import { DevApiKeyHelper } from './dev-api-key.helper';
import { DevApiKeyService } from './dev-api-key.service';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [DevApiKeyService, DevApiKeyHelper],
  controllers: [DevApiKeyController],
  exports: [DevApiKeyService, DevApiKeyHelper],
})
export class DevApiKeyModule {}
