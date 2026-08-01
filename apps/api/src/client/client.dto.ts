import { DtoProperty } from '@decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from './client.types';

export class OnboardClientDTO {
  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: 'itechdata.ai',
  })
  url: string;
}

export class ClientResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'Onboarded' })
  status: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    description: 'Extracted ClientContext (client.json) once onboarded.',
  })
  context: Record<string, unknown> | null;

  @ApiProperty({ required: false })
  createdAt?: Date;

  constructor(client: Client) {
    this.id = client.id;
    this.domain = client.domain;
    this.name = client.name;
    this.status = client.status;
    this.context = client.context;
    this.createdAt = client.createdAt;
  }
}

/**
 * Full overview for one client: the stored context plus the latest pipeline
 * artifacts (audit/strategy/manifest) read from runs/. Served as opaque JSON —
 * the dashboard owns the schemas (@rynk/core, @rynk/layer3-generate) and
 * validates on its side.
 */
export class ClientOverviewResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'Onboarded' })
  status: string;

  @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
  context: Record<string, unknown> | null;

  @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
  latestAudit: Record<string, unknown> | null;

  @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
  latestStrategy: Record<string, unknown> | null;

  @ApiProperty({ type: 'object', additionalProperties: true, nullable: true })
  latestManifest: Record<string, unknown> | null;

  @ApiProperty({ required: false, nullable: true })
  latestRunDate: string | null;

  constructor(params: {
    client: Client;
    latestAudit: Record<string, unknown> | null;
    latestStrategy: Record<string, unknown> | null;
    latestManifest: Record<string, unknown> | null;
    latestRunDate: string | null;
  }) {
    this.id = params.client.id;
    this.domain = params.client.domain;
    this.name = params.client.name;
    this.status = params.client.status;
    this.context = params.client.context;
    this.latestAudit = params.latestAudit;
    this.latestStrategy = params.latestStrategy;
    this.latestManifest = params.latestManifest;
    this.latestRunDate = params.latestRunDate;
  }
}
