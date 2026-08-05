import { Api, DecodedJwt } from '@decorator';
import { Body, Controller, Param } from '@nestjs/common';
import { AppError, UserPermission } from '@types';
import { isRynkAdmin } from '@helper';
import { AuthDetail } from '@user/types';
import { PipelineService } from 'src/pipeline/pipeline.service';
import {
  ClientOverviewResponse,
  ClientResponse,
  EditClientProfileDTO,
  OnboardClientDTO,
  SetClientAccessStatusDTO,
} from './client.dto';
import { ClientNotFoundError } from './client.error';
import { ClientService } from './client.service';
import { Client } from './client.types';
import { EditClientProfileUseCase, OnboardClientUseCase } from './initiator';

@Controller('client')
export class ClientController {
  constructor(
    private _clientService: ClientService,
    private _onboardClientUseCase: OnboardClientUseCase,
    private _editClientProfileUseCase: EditClientProfileUseCase,
    private _pipeline: PipelineService,
  ) {}

  /**
   * Row-level access: a rynk admin can reach any client; a client only its own.
   * Returns the client if allowed, otherwise a not-found error (we don't leak
   * existence to non-owners).
   */
  private accessOrThrow(client: Client, payload: AuthDetail): Client {
    if (isRynkAdmin(payload.roles) || client.isOwnedBy(payload.userId)) {
      return client;
    }
    throw new ClientNotFoundError();
  }

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
    const admin = isRynkAdmin(payload.roles);
    const result = admin
      ? await this._clientService.listAll()
      : await this._clientService.listForOwner(payload.userId);
    if (result instanceof AppError) {
      throw result;
    }
    // Admins see every client regardless of status; clients only see the
    // companies they can actually use (paid, trialing, or comped).
    const visible = admin ? result.data : result.data.filter((c) => c.isUsable());
    return visible.map((client) => new ClientResponse(client));
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
    return new ClientResponse(this.accessOrThrow(result, payload));
  }

  @Api({
    hasPermission: UserPermission.ManageClient,
    isPublic: false,
    path: ':id/status',
    verb: 'PATCH',
    swaggerSuccessResponse: ClientResponse,
  })
  async setAccessStatus(
    @DecodedJwt() payload: AuthDetail,
    @Param('id') id: string,
    @Body() body: SetClientAccessStatusDTO,
  ) {
    // Admin-only (ManageClient permission). Set a company's entitlement —
    // e.g. `comp` to give a beta client free access without payment.
    const client = await this._clientService.findById(id);
    if (client instanceof AppError) {
      throw client;
    }
    if (!isRynkAdmin(payload.roles)) {
      throw new ClientNotFoundError();
    }
    client.setAccessStatus(body.accessStatus);
    const saved = await this._clientService.save(client);
    if (saved instanceof AppError) {
      throw saved;
    }
    return new ClientResponse(saved);
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
      isAdmin: isRynkAdmin(payload.roles),
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
    const found = await this._clientService.findById(id);
    if (found instanceof AppError) {
      throw found;
    }
    const client = this.accessOrThrow(found, payload);
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
