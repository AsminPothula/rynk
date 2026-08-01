import { DtoProperty } from '@decorator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { Client } from './client.types';

export class OnboardClientDTO {
  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: 'itechdata.ai',
  })
  url: string;
}

/**
 * Partial edit of a client's onboarding profile (ClientContext). Every field is
 * optional — the dashboard Profile tab sends only what changed. Scalars/arrays
 * replace; `brand` and `presence` are deep-merged branch-wise on the server, so
 * a partial `brand` patch only touches the keys it names.
 */
export class EditClientProfileDTO {
  @DtoProperty({ type: 'String', isOptional: true })
  industry?: string;

  @DtoProperty({ type: 'String', isOptional: true })
  icp?: string;

  @DtoProperty({ type: 'String', isArray: true, isOptional: true })
  verticals?: string[];

  @DtoProperty({ type: 'String', isArray: true, isOptional: true })
  competitors?: string[];

  @DtoProperty({ type: 'String', isArray: true, isOptional: true })
  goals?: string[];

  @DtoProperty({ type: 'String', isArray: true, isOptional: true })
  seedKeywords?: string[];

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'Partial brand block — deep-merged into context.brand.',
  })
  brand?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'Partial presence block — deep-merged into context.presence.',
  })
  presence?: Record<string, unknown>;
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
