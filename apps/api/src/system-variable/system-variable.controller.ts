import { Config } from '@config';
import { Api } from '@decorator';
import { Body, Controller } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { AppError } from '@types';
import { UpdateSystemVariableUseCase } from './initiator';
import { UpdateSystemVariablesDTO } from './system-variable.dto';

@Controller('system-variable')
export class SystemVariableController {
  constructor(
    private readonly _updateSystemVariableUseCase: UpdateSystemVariableUseCase,
  ) {}

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
    path: '',
    verb: 'POST',
    swaggerSuccessResponse: null,
  })
  async updateSystemVariables(@Body() body: UpdateSystemVariablesDTO) {
    const result = await this._updateSystemVariableUseCase.execute(body);

    if (result instanceof AppError) {
      throw result;
    }
  }
}
