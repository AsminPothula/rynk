import { SAMPLE_EMAIL } from '@constant';
import { DtoProperty } from '@decorator';

export class UpdateSystemVariablesDTO {
  @DtoProperty({
    type: 'Email',
    isOptional: true,
    swaggerSampleValue: SAMPLE_EMAIL,
  })
  regional_director_email: string;
}
