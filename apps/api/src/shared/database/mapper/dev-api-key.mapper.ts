import { DevApiKeyPersistence } from '@persistence/dev-api-key.peristence';
import { DevApiKey } from 'src/dev-api-key/dev-api-key.type';

export class DevApiKeyMapper {
  static toDomain(data: DevApiKeyPersistence): DevApiKey {
    return DevApiKey.create({
      id: data.id,
      hashedApiKey: data.hashedApiKey,
      hmacId: data.hmacId,
      assignedTo: data.assignedTo,
      isAdmin: data.isAdmin,
      permissions: data.permissions,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  static toPersistence(data: DevApiKey): DevApiKeyPersistence {
    const DevApiKey = new DevApiKeyPersistence();
    Object.assign(DevApiKey, {
      id: data.id,
      hashedApiKey: data.hashedApiKey,
      hmacId: data.hmacId,
      assignedTo: data.assignedTo,
      isAdmin: data.isAdmin,
      permissions: data.permissions,
      deletedAt: data.deletedAt,
    });
    return DevApiKey;
  }
}
