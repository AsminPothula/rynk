import { FailedToSaveResourceError } from '@error';
import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { UserRolePersistence } from '@persistence/user-role.persistence';
import { UserRole } from 'src/user/user-role/user-role.type';
import { UserRoleMapper } from '../mapper/user-role.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRolePersistence> {
  protected model = UserRolePersistence;
  private _logger = new LogService(UserRoleRepository.name);

  async save(userRole: UserRole) {
    const persistence = UserRoleMapper.toPersistence(userRole);
    const repo = this.getDBRepository();
    try {
      const savedUserRole = await repo.save(persistence);
      return UserRoleMapper.toDomain(savedUserRole);
    } catch (e) {
      this._logger.error(e);
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save user role',
      );
    }
  }

  async saveMany(userRoles: UserRole[]) {
    const list = userRoles.map(UserRoleMapper.toPersistence);
    const repo = this.getDBRepository();
    try {
      await repo.save(list);
      return true;
    } catch (e) {
      this._logger.error(e);
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save user role',
      );
    }
  }
}
