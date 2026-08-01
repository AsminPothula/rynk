import { RunPersistence } from '@persistence/run.persistence';
import { Run, RunPhaseType } from 'src/run/run.types';

export class RunMapper {
  static toDomain(data: RunPersistence): Run {
    return Run.create({
      id: data.id,
      clientId: data.clientId,
      domain: data.domain,
      phase: data.phase as RunPhaseType,
      error: data.error ?? null,
      startedAt: data.startedAt,
      completedAt: data.completedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  static toPersistence(data: Run): RunPersistence {
    const persistence = new RunPersistence();
    Object.assign(persistence, {
      id: data.id,
      clientId: data.clientId,
      domain: data.domain,
      phase: data.phase,
      error: data.error,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    });
    return persistence;
  }
}
