import { Api, DecodedJwt } from '@decorator';
import { Body, Controller, Param } from '@nestjs/common';
import { AppError, UserPermission } from '@types';
import { AuthDetail } from '@user/types';
import { PipelineService } from 'src/pipeline/pipeline.service';
import {
  ClientOverviewResponse,
  ClientResponse,
  EditClientProfileDTO,
  OnboardClientDTO,
} from './client.dto';
import { ClientNotFoundError } from './client.error';
import { ClientService } from './client.service';
import { EditClientProfileUseCase, OnboardClientUseCase } from './initiator';

@Controller('client')
export class ClientController {
  constructor(
    private _clientService: ClientService,
    private _onboardClientUseCase: OnboardClientUseCase,
    private _editClientProfileUseCase: EditClientProfileUseCase,
    private _pipeline: PipelineService,
  ) {}

  @Api({
    isPublic: false,
    path: '',
    verb: 'POST',
    swaggerSuccessResponse: ClientResponse,
  })
  async onboard(
    @DecodedJwt() payload: AuthDetail,
    @Body() body: OnboardClientDTO,
  ) {
    const result = await this._onboardClientUseCase.execute({
      url: body.url,
      ownerId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
    return new ClientResponse(result);
  }

  @Api({
    isPublic: false,
    path: '',
    verb: 'GET',
    disableCache: true,
    swaggerSuccessResponse: ClientResponse,
  })
  async list(@DecodedJwt() payload: AuthDetail) {
    const result = await this._clientService.listForOwner(payload.userId);
    if (result instanceof AppError) {
      throw result;
    }
    return result.data.map((client) => new ClientResponse(client));
  }

  @Api({
    isPublic: false,
    path: ':id',
    verb: 'GET',
    disableCache: true,
    swaggerSuccessResponse: ClientResponse,
  })
  async get(@DecodedJwt() payload: AuthDetail, @Param('id') id: string) {
    const result = await this._clientService.findById(id);
    if (result instanceof AppError) {
      throw result;
    }
    if (!result.isOwnedBy(payload.userId)) {
      throw new ClientNotFoundError();
    }
    return new ClientResponse(result);
  }

  @Api({
    hasPermission: UserPermission.ManageClient,
    isPublic: false,
    path: ':id/profile',
    verb: 'PATCH',
    swaggerSuccessResponse: ClientResponse,
  })
  async editProfile(
    @DecodedJwt() payload: AuthDetail,
    @Param('id') id: string,
    @Body() body: EditClientProfileDTO,
  ) {
    const result = await this._editClientProfileUseCase.execute({
      clientId: id,
      actorId: payload.userId,
      patch: { ...body },
    });
    if (result instanceof AppError) {
      throw result;
    }
    return new ClientResponse(result);
  }

  @Api({
    isPublic: false,
    path: ':id/overview',
    verb: 'GET',
    disableCache: true,
    swaggerSuccessResponse: ClientOverviewResponse,
  })
  async overview(@DecodedJwt() payload: AuthDetail, @Param('id') id: string) {
    const client = await this._clientService.findById(id);
    if (client instanceof AppError) {
      throw client;
    }
    if (!client.isOwnedBy(payload.userId)) {
      throw new ClientNotFoundError();
    }
    const domain = client.domain;
    return new ClientOverviewResponse({
      client,
      latestAudit: this._pipeline.readAudit(domain),
      latestStrategy: this._pipeline.readStrategy(domain),
      latestManifest: this._pipeline.readManifest(domain),
      latestRunDate: this._pipeline.findLatestRunDate(domain),
    });
  }
}
