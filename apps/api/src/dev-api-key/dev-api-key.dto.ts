import { SAMPLE_API_KEY, SAMPLE_NAME } from '@constant';
import { DtoProperty, ResponseProperty } from '@decorator';
import { guardEmpty } from '@helper';
import { DevApiKeyPermissions, DevApiKeyPermissionsType } from '@types';

export class Lib3DDevApiKeyDTO {
  @ResponseProperty(SAMPLE_API_KEY, {
    type: 'string',
  })
  readonly apiKey: string;

  @ResponseProperty(SAMPLE_NAME, {
    type: 'string',
  })
  readonly assignedTo: string;

  constructor(data: { apiKey: string; assignedTo: string }) {
    this.apiKey = guardEmpty(data.apiKey);
    this.assignedTo = guardEmpty(data.assignedTo);
  }
}

export class CreateDevApiKeyDTO {
  @DtoProperty({
    type: 'String',
    swaggerSampleValue: 'John Doe',
  })
  assignedTo: string;

  @DtoProperty({
    type: 'Enum',
    enumType: DevApiKeyPermissions,
    isArray: true,
    swaggerSampleValue: [
      DevApiKeyPermissions.UploadDataMigration,
      DevApiKeyPermissions.UpdateSystemVariables,
    ],
  })
  permissions: DevApiKeyPermissionsType[];
}
