import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { TransactionHelper, UserRoleRepository } from '@shared';
import { UserRole } from './user-role.type';

@Injectable()
export class UserRoleService {
  private _logger = new LogService(UserRoleService.name);

  constructor(
    private _userRoleRepo: UserRoleRepository,
    private _transactionHelper: TransactionHelper,
  ) {}

  async save(user: UserRole) {
    const saveResult = await this._userRoleRepo.save(user);
    return saveResult;
  }

  async saveMany(users: UserRole[]) {
    const saveResult = await this._userRoleRepo.saveMany(users);
    return saveResult;
  }

  async delete(roles?: UserRole[]) {
    if (!roles || !roles.length) {
      return true;
    }
    const updatedRoles = roles.map((role) => {
      role.delete();
      return role;
    });
    const result = await this._userRoleRepo.saveMany(updatedRoles);
    return result;
  }
}
