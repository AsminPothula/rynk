import { Api, DecodedJwt } from '@decorator';
import { Body, Controller, Param, Query } from '@nestjs/common';
import { AppError } from '@types';
import { AuthDetail } from '@user/types';
import { ClientNotFoundError } from 'src/client/client.error';
import { ClientService } from 'src/client/client.service';
import { SyncRunStatusUseCase, TriggerRunUseCase } from './initiator';
import { RunResponse, TriggerRunDTO } from './run.dto';
import { RunService } from './run.service';

@Controller('run')
export class RunController {
  constructor(
    private _clientService: ClientService,
    private _runService: RunService,
    private _triggerRunUseCase: TriggerRunUseCase,
    private _syncRunStatusUseCase: SyncRunStatusUseCase,
  ) {}

  @Api({
    isPublic: false,
    path: '',
    verb: 'POST',
    swaggerSuccessResponse: RunResponse,
  })
  async trigger(@DecodedJwt() payload: AuthDetail, @Body() body: TriggerRunDTO) {
    const result = await this._triggerRunUseCase.execute({
      clientId: body.clientId,
      ownerId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
    return new RunResponse(result);
  }

  @Api({
    isPublic: false,
    path: ':id',
    verb: 'GET',
    disableCache: true,
    swaggerSuccessResponse: RunResponse,
  })
  async get(@DecodedJwt() payload: AuthDetail, @Param('id') id: string) {
    const result = await this._syncRunStatusUseCase.execute({
      runId: id,
      ownerId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
    return new RunResponse(result);
  }

  @Api({
    isPublic: false,
    path: '',
    verb: 'GET',
    disableCache: true,
    swaggerRequestQueries: [{ name: 'clientId', required: true }],
    swaggerSuccessResponse: RunResponse,
  })
  async list(
    @DecodedJwt() payload: AuthDetail,
    @Query('clientId') clientId: string,
  ) {
    const client = await this._clientService.findById(clientId);
    if (client instanceof AppError) {
      throw client;
    }
    if (!client.isOwnedBy(payload.userId)) {
      throw new ClientNotFoundError();
    }
    const result = await this._runService.listForClient(clientId);
    if (result instanceof AppError) {
      throw result;
    }
    return result.data.map((run) => new RunResponse(run));
  }
}
