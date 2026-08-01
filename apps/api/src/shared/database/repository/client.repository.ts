import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';
import { Injectable } from '@nestjs/common';
import { Pagination } from '@types';
import { ClientPersistence } from '@persistence/client.persistence';
import { ClientNotFoundError } from 'src/client/client.error';
import { Client, FindClientSpecs } from 'src/client/client.types';
import { ClientMapper } from '../mapper/client.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class ClientRepository extends BaseRepository<ClientPersistence> {
  protected model = ClientPersistence;

  async save(client: Client) {
    const persistence = ClientMapper.toPersistence(client);
    const repo = this.getDBRepository();
    try {
      const saved = await repo.save(persistence);
      return ClientMapper.toDomain(saved);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save client',
      );
    }
  }

  async findOne(specs: FindClientSpecs) {
    const repo = this.getDBRepository();
    try {
      const persistence = await repo.findOne({
        where: {
          id: specs.id ?? undefined,
          domain: specs.domain ?? undefined,
          ownerId: specs.ownerId ?? undefined,
        },
      });
      if (!persistence) {
        return new ClientNotFoundError();
      }
      return ClientMapper.toDomain(persistence);
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get client',
      );
    }
  }

  async findMany(specs: FindClientSpecs) {
    const repo = this.getDBRepository();
    try {
      const [rows, total] = await repo.findAndCount({
        where: {
          ownerId: specs.ownerId ?? undefined,
          domain: specs.domain ?? undefined,
        },
        order: { createdAt: 'DESC' },
        take: specs.limit,
        skip: specs.offset,
      });
      return {
        data: rows.map(ClientMapper.toDomain),
        total,
      } as Pagination<Client>;
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to list clients',
      );
    }
  }
}
