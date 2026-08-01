import { ClientPersistence } from '@persistence/client.persistence';
import { Client, ClientStatusType } from 'src/client/client.types';

export class ClientMapper {
  static toDomain(data: ClientPersistence): Client {
    return Client.create({
      id: data.id,
      domain: data.domain,
      name: data.name,
      ownerId: data.ownerId,
      status: data.status as ClientStatusType,
      context: data.context ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  static toPersistence(data: Client): ClientPersistence {
    const persistence = new ClientPersistence();
    Object.assign(persistence, {
      id: data.id,
      domain: data.domain,
      name: data.name,
      ownerId: data.ownerId,
      status: data.status,
      context: data.context,
    });
    return persistence;
  }
}
