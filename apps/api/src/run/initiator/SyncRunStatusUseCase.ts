import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { ClientService } from 'src/client/client.service';
import { PipelineService } from 'src/pipeline/pipeline.service';
import { RunNotFoundError } from '../run.error';
import { RunService } from '../run.service';
import { RunPhaseType } from '../run.types';

/**
 * Read the run: if it's not already in a terminal phase, sync its phase from
 * what the pipeline wrote to runs/{slug}/status.json and persist the change.
 */
@Injectable()
export class SyncRunStatusUseCase {
  constructor(
    private _runService: RunService,
    private _clientService: ClientService,
    private _pipeline: PipelineService,
  ) {}

  async execute(params: { runId: string; ownerId: string }) {
    const { runId, ownerId } = params;

    const run = await this._runService.findById(runId);
    if (run instanceof AppError) {
      return run;
    }

    const client = await this._clientService.findById(run.clientId);
    if (client instanceof AppError) {
      return client;
    }
    if (!client.isOwnedBy(ownerId)) {
      return new RunNotFoundError();
    }

    if (!run.isTerminal()) {
      const status = this._pipeline.readRunStatus(run.domain);
      if (status) {
        run.syncPhase(status.phase as RunPhaseType, status.error ?? null);
        return this._runService.save(run);
      }
    }
    return run;
  }
}
