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
