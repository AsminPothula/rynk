import { Config } from '@config';
import { Api } from '@decorator';
import { Controller } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { CronService } from 'src/shared/cron/cron.service';

@Controller('cron')
export class CronController {
  constructor(private _cronService: CronService) {}

  @ApiHeader({
    name: Config.DevApi.DevApiKeyHeaderName,
    description: 'Server key for authorization',
    required: true,
  })
  @Api({
    hasDevApiKey: {
      adminOnly: false,
      otherDevPermissions: ['USV'],
    },
    verb: 'POST',
    path: '/init-locks',
    swaggerSuccessResponse: null,
  })
  async initializeCronLocks() {
    await this._cronService.createCronJobLocks();
  }
}
