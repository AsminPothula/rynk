import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LogService } from '@logger';

/**
 * The one place the API talks to the pipeline.
 *
 * We deliberately shell out to `tsx` rather than importing @rynk/orchestrator:
 * the pipeline is ESM (this app is CommonJS), it's a long-running job that
 * calls process.exit and loads its own env, so it's cleanest as a separate
 * process writing to runs/, which we read back. This mirrors what the Next.js
 * dashboard already does (apps/dashboard/src/lib/pipeline).
 *
 * cwd for every spawn is the repo root so the child's dotenv finds the root
 * .env and its runs/ path math resolves.
 */

type Script = 'onboard' | 'run-layers';

/** The shape the pipeline writes to runs/{slug}/status.json. */
export interface PipelineRunStatus {
  domain: string;
  phase:
    | 'onboarding'
    | 'onboarded'
    | 'layer1'
    | 'layer2'
    | 'layer3'
    | 'done'
    | 'failed';
  updatedAt: string;
  error?: string;
}

@Injectable()
export class PipelineService {
  private _logger = new LogService(PipelineService.name);

  /** Repo root, relative to the API's runtime cwd (apps/api). */
  private repoRoot(): string {
    return resolve(process.cwd(), '..', '..');
  }

  private scriptPath(script: Script): string {
    return `packages/orchestrator/src/web/${script}.ts`;
  }

  /** Same slug transform the pipeline uses for the runs/ dir name. */
  safeDomainSlug(domain: string): string {
    return domain.replace(/[^a-z0-9.-]/gi, '_');
  }

  /** Mirrors packages/orchestrator/src/web/normalize-domain.ts. */
  normalizeDomain(input: string): string {
    let s = input.trim().toLowerCase();
    s = s.replace(/^https?:\/\//, '');
    s = s.replace(/^www\./, '');
    s = s.split('/')[0] ?? s;
    s = s.split('?')[0] ?? s;
    s = s.split('#')[0] ?? s;
    s = s.replace(/:\d+$/, '');
    return s.trim();
  }

  private runDomainDir(domain: string): string {
    return resolve(this.repoRoot(), 'runs', this.safeDomainSlug(domain));
  }

  /**
   * Run onboarding and wait for it to finish (short, ~1 min). The caller
   * wants the extracted client.json before responding.
   */
  onboardAndWait(domain: string): Promise<{ code: number; stderr: string }> {
    return this.spawnAndWait('onboard', domain);
  }

  /**
   * Fire-and-forget the Layer 1-3 run (minutes). The caller returns
   * immediately and polls status.json via readRunStatus().
   */
  startLayersDetached(domain: string): void {
    const child = spawn('npx', ['tsx', this.scriptPath('run-layers'), domain], {
      cwd: this.repoRoot(),
      env: process.env,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    this._logger.log(`spawned detached run-layers for ${domain}`);
  }

  private spawnAndWait(
    script: Script,
    domain: string,
  ): Promise<{ code: number; stderr: string }> {
    return new Promise((resolveP) => {
      const child = spawn('npx', ['tsx', this.scriptPath(script), domain], {
        cwd: this.repoRoot(),
        env: process.env,
      });
      let stderr = '';
      child.stderr.on('data', (d) => {
        stderr += String(d);
      });
      child.on('close', (code) => resolveP({ code: code ?? 1, stderr }));
      child.on('error', (err) => resolveP({ code: 1, stderr: String(err) }));
    });
  }

  /** Read the ClientContext the onboarding step wrote (opaque JSON to us). */
  readClientContext(domain: string): Record<string, unknown> | null {
    return this.readJson(resolve(this.runDomainDir(domain), 'client.json'));
  }

  /** Read the current run phase the pipeline wrote. */
  readRunStatus(domain: string): PipelineRunStatus | null {
    return this.readJson<PipelineRunStatus>(
      resolve(this.runDomainDir(domain), 'status.json'),
    );
  }

  private readJson<T = Record<string, unknown>>(path: string): T | null {
    if (!existsSync(path)) {
      return null;
    }
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as T;
    } catch (e) {
      this._logger.error(
        new Error(`failed to read/parse ${path}: ${String(e)}`),
      );
      return null;
    }
  }
}
