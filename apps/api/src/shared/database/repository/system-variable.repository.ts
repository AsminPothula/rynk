import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';

import { Injectable } from '@nestjs/common';
import { Pagination } from '@types';

import { SystemVariablePersistence } from '@persistence/system-variable.persistence';
import { SystemVariableNotFoundError } from 'src/system-variable/system-variable.error';
import {
  FindSystemVariableSpecs,
  SystemVariable,
} from 'src/system-variable/system-variable.types';
import { SystemVariableMapper } from '../mapper/system-variable.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class SystemVariableRepository extends BaseRepository<SystemVariablePersistence> {
  protected model = SystemVariablePersistence;

  async save(variable: SystemVariable) {
    const persistence = SystemVariableMapper.toPersistence(variable);
    const repo = this.getDBRepository();
    try {
      const savedProduct = await repo.save(persistence);
      return SystemVariableMapper.toDomain(savedProduct);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save system varibales',
      );
    }
  }

  async saveMany(variables: SystemVariable[]) {
    const persistences = variables.map(SystemVariableMapper.toPersistence);
    const repo = this.getDBRepository();
    try {
      await repo.save(persistences);
      return true;
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save system varibales',
      );
    }
  }

  async findOne(specs: FindSystemVariableSpecs) {
    const repo = this.getDBRepository();
    try {
      const persistence = await repo.findOne({
        where: {
          id: specs.id ?? undefined,
          name: specs.name ?? undefined,
        },
      });
      if (!persistence) {
        return new SystemVariableNotFoundError();
      }
      return SystemVariableMapper.toDomain(persistence);
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get system variable',
      );
    }
  }

  async findMany(specs: FindSystemVariableSpecs) {
    const repo = this.getDBRepository();
    try {
      const [rows, total] = await repo.findAndCount({
        where: {
          id: specs.id ?? undefined,
        },
        take: specs.limit,
        skip: specs.offset,
      });
      return {
        data: rows.map(SystemVariableMapper.toDomain),
        total,
      } as Pagination<SystemVariable>;
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get system variable',
      );
    }
  }

  async delete(specs: FindSystemVariableSpecs) {
    const repo = this.getDBRepository();
    try {
      const deletedResult = await repo.delete({
        id: specs.id,
      });
      return deletedResult;
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to delete system varibales',
      );
    }
  }
}
