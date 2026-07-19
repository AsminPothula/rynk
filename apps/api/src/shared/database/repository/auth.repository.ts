import { Auth, FindAuthSpecs } from '@auth/types';
import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';
import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { AuthPersistence } from '@persistence/auth.persistence';
import { UserNotFoundError } from 'src/user/user.error';
import { In } from 'typeorm';
import { AuthMapper } from '../mapper/auth.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class AuthRepository extends BaseRepository<AuthPersistence> {
  protected model = AuthPersistence;
  private _logger = new LogService(AuthRepository.name);

  async findOne(specs: FindAuthSpecs) {
    try {
      const repo = this.getDBRepository();
      const persistence = await repo.findOne({
        relations: {
          user: {
            roles: true,
          },
        },
        where: {
          user:
            specs.userId || specs.userEmail
              ? {
                  id: specs.userId,
                  email: specs.userEmail,
                }
              : undefined,
          password: specs.password,
          passwordToken: specs.passwordToken,
        },
      });
      if (!persistence) {
        return new UserNotFoundError();
      }
      return AuthMapper.toDomain(persistence);
    } catch (e) {
      this._logger.error(e);
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get user',
      );
    }
  }

  async save(auth: Auth) {
    const persistence = AuthMapper.toPersistence(auth);
    const repo = this.getDBRepository();
    try {
      const savedAuth = await repo.save(persistence);
      return AuthMapper.toDomain(savedAuth);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save auth',
      );
    }
  }

  async delete(specs: FindAuthSpecs) {
    const repo = this.getDBRepository();
    try {
      if (
        !specs.userId &&
        (!specs.userIdList ||
          !Array.isArray(specs.userIdList) ||
          specs.userIdList.length === 0)
      ) {
        return new FailedToSaveResourceError(
          'External',
          'User id value not exists',
        );
      }
      const deletedResult = await repo.delete({
        user: specs.userId
          ? { id: specs.userId }
          : specs.userIdList
          ? {
              id: In(specs.userIdList),
            }
          : undefined,
      });
      return deletedResult;
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to delete auth',
      );
    }
  }
}
