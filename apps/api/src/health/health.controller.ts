import { Api } from '@decorator';
import { Controller, VERSION_NEUTRAL } from '@nestjs/common';
import { AppErrorTypeValues } from '@types';
import { HealthReponse } from './health.dto';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'status',
})
export class HealthController {
  @Api({
    isPublic: true,
    disableCache: true,
    verb: 'GET',
    path: '/',
    swaggerSuccessResponse: HealthReponse,
    swaggerRequestQueries: [
      {
        enum: AppErrorTypeValues,
        enumName: 'ErrorType',
        required: false,
      },
    ],
  })
  getHealthStatus(): HealthReponse {
    return new HealthReponse('OK');
  }
}
