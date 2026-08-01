import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { ClientNotFoundError } from 'src/client/client.error';
import { ClientService } from 'src/client/client.service';
import { PipelineService } from 'src/pipeline/pipeline.service';
import { RunService } from '../run.service';
import { Run } from '../run.types';

/**
 * Trigger a pipeline run (Layers 1-3) for a client. Creates the Run row,
 * then fires the pipeline detached (it takes minutes). The caller polls
 * GET /run/:id, which syncs the phase from status.json.
 */
@Injectable()
export class TriggerRunUseCase {
  constructor(
    private _clientService: ClientService,
    private _runService: RunService,
    private _pipeline: PipelineService,
  ) {}

  async execute(params: { clientId: string; ownerId: string }) {
    const { clientId, ownerId } = params;

    const client = await this._clientService.findById(clientId);
    if (client instanceof AppError) {
      return client;
    }
    if (!client.isOwnedBy(ownerId)) {
      // Hide existence of clients the caller doesn't own.
      return new ClientNotFoundError();
    }

    const run = Run.createNew({ clientId: client.id, domain: client.domain });
    const saved = await this._runService.save(run);
    if (saved instanceof AppError) {
      return saved;
    }

    this._pipeline.startLayersDetached(client.domain);
    return saved;
  }
}
