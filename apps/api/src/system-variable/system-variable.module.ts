import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { DevApiKeyModule } from 'src/dev-api-key/dev-api-key.module';
import { useCases } from './initiator';
import { SystemVariableController } from './system-variable.controller';
import { SystemVariableService } from './system-variable.service';
@Module({
  imports: [SharedModule, DevApiKeyModule],
  providers: [SystemVariableService, ...useCases],
  controllers: [SystemVariableController],
  exports: [SystemVariableService],
})
export class SystemVariableModule {}
