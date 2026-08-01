import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { ClientModule } from 'src/client/client.module';
import { PipelineModule } from 'src/pipeline/pipeline.module';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { useCases } from './initiator';

@Module({
  imports: [SharedModule, PipelineModule, ClientModule],
  controllers: [RunController],
  providers: [RunService, ...useCases],
  exports: [RunService],
})
export class RunModule {}
