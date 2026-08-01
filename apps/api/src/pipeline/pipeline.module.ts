import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';

/**
 * Wraps the rynk pipeline (packages/*) behind one injectable service.
 * Imported by any module that needs to trigger or read pipeline runs.
 */
@Module({
  providers: [PipelineService],
  exports: [PipelineService],
})
export class PipelineModule {}
