import { Config } from '@config';
import { Api } from '@decorator';
import { Body, Controller } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { AppError } from '@types';
import { CreateDevApiKeyDTO, Lib3DDevApiKeyDTO } from './dev-api-key.dto';
import { DevApiKeyService } from './dev-api-key.service';
@Controller({
  path: 'dev-api-key',
})
export class DevApiKeyController {
  constructor(private _devApiKeyService: DevApiKeyService) {}

  @ApiHeader({
    name: Config.DevApi.DevApiKeyHeaderName,
    description: 'Server key for authorization',
    required: true,
  })
  @Api({
    hasDevApiKey: {
      adminOnly: true,
    },
    verb: 'POST',
    path: '',
    swaggerSuccessResponse: Lib3DDevApiKeyDTO,
  })
  async createDevApiKey(@Body() body: CreateDevApiKeyDTO) {
    const details = await this._devApiKeyService.create({ ...body });
    if (details.keyInfo instanceof AppError) {
      throw details.keyInfo;
    }
    return new Lib3DDevApiKeyDTO({
      apiKey: details.savedApiKey,
      assignedTo: details.keyInfo.assignedTo,
    });
  }

  @ApiHeader({
    name: Config.DevApi.DevApiKeyHeaderName,
    description: 'Server key for authorization',
    required: true,
  })
  @Api({
    hasDevApiKey: {
      adminOnly: false,
      otherDevPermissions: ['MTD', 'USV'],
    },
    verb: 'GET',
    path: '/test-dev-api-key',
    swaggerSuccessResponse: null,
  })
  async TestDevApiKey() {
    return true;
  }

  @ApiHeader({
    name: Config.DevApi.DevApiKeyHeaderName,
    description: 'Server key for authorization',
    required: true,
  })
  @Api({
    hasDevApiKey: {
      adminOnly: true,
    },
    verb: 'GET',
    path: '/test-admin-dev-api-key',
    swaggerSuccessResponse: null,
  })
  async TestAdminDevApiKey() {
    return true;
  }
}
