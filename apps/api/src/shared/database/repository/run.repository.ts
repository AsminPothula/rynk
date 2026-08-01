import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';
import { Injectable } from '@nestjs/common';
import { Pagination } from '@types';
import { RunPersistence } from '@persistence/run.persistence';
import { RunNotFoundError } from 'src/run/run.error';
import { FindRunSpecs, Run } from 'src/run/run.types';
import { RunMapper } from '../mapper/run.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class RunRepository extends BaseRepository<RunPersistence> {
  protected model = RunPersistence;

  async save(run: Run) {
    const persistence = RunMapper.toPersistence(run);
    const repo = this.getDBRepository();
    try {
      const saved = await repo.save(persistence);
      return RunMapper.toDomain(saved);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save run',
      );
    }
  }

  async findOne(specs: FindRunSpecs) {
    const repo = this.getDBRepository();
    try {
      const persistence = await repo.findOne({
        where: {
          id: specs.id ?? undefined,
          clientId: specs.clientId ?? undefined,
        },
      });
      if (!persistence) {
        return new RunNotFoundError();
      }
      return RunMapper.toDomain(persistence);
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get run',
      );
    }
  }

  async findMany(specs: FindRunSpecs) {
    const repo = this.getDBRepository();
    try {
      const [rows, total] = await repo.findAndCount({
        where: {
          clientId: specs.clientId ?? undefined,
        },
        order: { createdAt: 'DESC' },
        take: specs.limit,
        skip: specs.offset,
      });
      return {
        data: rows.map(RunMapper.toDomain),
        total,
      } as Pagination<Run>;
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to list runs',
      );
    }
  }
}
