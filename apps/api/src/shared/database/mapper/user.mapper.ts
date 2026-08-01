import { UserPersistence } from '@persistence/user.persistence';
import { User, UserStatusType } from '@user/types';
import { UserRoleMapper } from './user-role.mapper';

export class UserMapper {
  static toDomain(data: UserPersistence): User {
    return User.create({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      roles: data.roles ? data.roles.map(UserRoleMapper.toDomain) : [],
      status: data.status as UserStatusType,
      statusChangedAt: data.statusChangedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      deactivatedAt: data.deactivatedAt,
      isEmailVerified: data.isEmailVerified,
      verificationEmailLastSent: data.verificationEmailLastSent,
      signUpMode: data.signUpMode,
      isGuest: data.isGuest,
    });
  }

  static toPersistence(data: User): UserPersistence {
    const user = new UserPersistence();
    Object.assign(user, {
      id: data.id,
      email: data.email,
      status: data.status as UserStatusType,
      statusChangedAt: data.statusChangedAt,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      roles: data.roles ? data.roles.map(UserRoleMapper.toPersistence) : [],
      deletedAt: data.deletedAt,
      deactivatedAt: data.deactivatedAt,
      isEmailVerified: data.isEmailVerified,
      verificationEmailLastSent: data.verificationEmailLastSent,
      signUpMode: data.signUpMode,
      isGuest: data.isGuest,
    });
    return user;
  }
}
