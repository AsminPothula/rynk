import { UserRolePersistence } from '@persistence/user-role.persistence';
import { UserRole } from 'src/user/user-role/user-role.type';
import { UserMapper } from './user.mapper';

export class UserRoleMapper {
  static toDomain(data: UserRolePersistence): UserRole {
    return UserRole.create({
      id: data.id,
      user: data.user ? UserMapper.toDomain(data.user) : undefined,
      role: data.role,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  static toPersistence(data: UserRole): UserRolePersistence {
    const userRole = new UserRolePersistence();
    Object.assign(userRole, {
      id: data.id,
      role: data.role,
      userId: data.userId,
      deletedAt: data.deletedAt,
    });
    return userRole;
  }
}
