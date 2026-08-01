import { DtoProperty } from '@decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Run } from './run.types';

export class TriggerRunDTO {
  @DtoProperty({ type: 'UUID', isNotEmpty: true })
  clientId: string;
}

export class RunResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  domain: string;

  @ApiProperty({ example: 'layer1' })
  phase: string;

  @ApiProperty({ required: false, nullable: true })
  error: string | null;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  completedAt: Date | null;

  constructor(run: Run) {
    this.id = run.id;
    this.clientId = run.clientId;
    this.domain = run.domain;
    this.phase = run.phase;
    this.error = run.error;
    this.startedAt = run.startedAt;
    this.completedAt = run.completedAt;
  }
}
