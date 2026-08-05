import { ClientPersistence } from '@persistence/client.persistence';
import { AccessStatusType, Client, ClientStatusType } from 'src/client/client.types';

export class ClientMapper {
  static toDomain(data: ClientPersistence): Client {
    return Client.create({
      id: data.id,
      domain: data.domain,
      name: data.name,
      ownerId: data.ownerId,
      status: data.status as ClientStatusType,
      accessStatus: (data.accessStatus ?? 'none') as AccessStatusType,
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
      accessStatus: data.accessStatus,
      context: data.context,
    });
    return persistence;
  }
}
