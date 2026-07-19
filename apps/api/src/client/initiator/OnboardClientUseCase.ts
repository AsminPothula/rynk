import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { PipelineService } from 'src/pipeline/pipeline.service';
import { ClientAlreadyExistsError, PipelineFailedError } from '../client.error';
import { ClientService } from '../client.service';
import { Client } from '../client.types';

/**
 * Onboard a domain: run the pipeline's onboarding step (scrape + AI extract),
 * store the resulting client.json on the Client row, mark it Onboarded.
 *
 * Waits for onboarding to finish (it's the short step, ~1 min) so the caller
 * gets the extracted context back to review before running the layers.
 */
@Injectable()
export class OnboardClientUseCase {
  constructor(
    private _clientService: ClientService,
    private _pipeline: PipelineService,
  ) {}

  async execute(params: { url: string; ownerId: string }) {
    const { url, ownerId } = params;
    const domain = this._pipeline.normalizeDomain(url);

    // Create-or-reuse the client row (re-onboarding refreshes its context).
    const existing = await this._clientService.findByDomain(domain);
    let client: Client;
    if (existing instanceof Client) {
      if (!existing.isOwnedBy(ownerId)) {
        return new ClientAlreadyExistsError();
      }
      client = existing;
    } else {
      client = Client.createNew({ domain, ownerId });
    }

    const saved = await this._clientService.save(client);
    if (saved instanceof AppError) {
      return saved;
    }
    client = saved;

    // Run onboarding and wait for client.json.
    const result = await this._pipeline.onboardAndWait(domain);
    if (result.code !== 0) {
      client.markFailed();
      await this._clientService.save(client);
      return new PipelineFailedError(
        result.stderr.slice(-500) || 'Onboarding failed',
      );
    }

    const context = this._pipeline.readClientContext(domain);
    if (!context) {
      client.markFailed();
      await this._clientService.save(client);
      return new PipelineFailedError('Onboarding produced no client.json');
    }

    client.markOnboarded(context);
    return this._clientService.save(client);
  }
}
