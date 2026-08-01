import { Auth } from '@auth/types';
import { AuthPersistence } from '@persistence/auth.persistence';
import { UserMapper } from './user.mapper';

export class AuthMapper {
  static toDomain(data: AuthPersistence): Auth {
    return Auth.create({
      id: data.id,
      password: data.password,
      passwordChangedAt: data.passwordChangedAt,
      oldPasswords: data.oldPasswords?.split(',') ?? [],
      user: UserMapper.toDomain(data.user),
      deactivatedAt: data.deactivatedAt,
      passwordToken: data.passwordToken,
      passwordTokenIssuedAt: data.passwordTokenIssuedAt,
    });
  }

  static toPersistence(data: Auth): AuthPersistence {
    const auth = new AuthPersistence();
    Object.assign(auth, {
      id: data.id,
      password: data.password,
      passwordChangedAt: data.passwordChangedAt,
      oldPasswords: data.oldPasswords.join(','),
      user: UserMapper.toPersistence(data.user),
      passwordToken: data.passwordToken,
      passwordTokenIssuedAt: data.passwordTokenIssuedAt,
    });
    return auth;
  }
}
