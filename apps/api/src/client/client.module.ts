import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { PipelineModule } from 'src/pipeline/pipeline.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { useCases } from './initiator';

@Module({
  imports: [SharedModule, PipelineModule],
  controllers: [ClientController],
  providers: [ClientService, ...useCases],
  exports: [ClientService],
})
export class ClientModule {}
