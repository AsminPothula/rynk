import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { PipelineService } from 'src/pipeline/pipeline.service';
import {
  ClientNotFoundError,
  ClientNotOnboardedError,
} from '../client.error';
import { ClientService } from '../client.service';
import { Client } from '../client.types';

/**
 * Edit an onboarded client's profile (its ClientContext).
 *
 * Access control:
 *   - The route requires the ManageClient permission (RBAC via @Api).
 *   - Here we additionally enforce row-level ownership: a user can only edit
 *     clients they own, so ManageClient never grants cross-tenant edits.
 *
 * The merged context is saved on the Client row (source of truth for display)
 * and mirrored to runs/{slug}/client.json so the next pipeline run uses it.
 */
@Injectable()
export class EditClientProfileUseCase {
  constructor(
    private _clientService: ClientService,
    private _pipeline: PipelineService,
  ) {}

  async execute(params: {
    clientId: string;
    actorId: string;
    patch: Record<string, unknown>;
  }): Promise<Client | AppError> {
    const { clientId, actorId, patch } = params;

    const client = await this._clientService.findById(clientId);
    if (client instanceof AppError) {
      return client;
    }
    // Ownership — do not leak existence to non-owners.
    if (!client.isOwnedBy(actorId)) {
      return new ClientNotFoundError();
    }
    // Can't edit a profile that was never extracted.
    if (client.context === null) {
      return new ClientNotOnboardedError();
    }

    const merged = client.updateProfile(patch);

    const saved = await this._clientService.save(client);
    if (saved instanceof AppError) {
      return saved;
    }

    // Keep the file the pipeline reads in sync with the DB. Non-fatal: the DB
    // is the source of truth; a file write failure shouldn't lose the edit.
    try {
      this._pipeline.writeClientContext(saved.domain, merged);
    } catch {
      // Swallowed intentionally — surfaced via logs in PipelineService callers.
    }

    return saved;
  }
}
