import { FailedToGetResourceError, FailedToSaveResourceError } from '@error';
import { Injectable } from '@nestjs/common';
import { UserPersistence } from '@persistence/user.persistence';
import { Pagination } from '@types';
import { FindUserSpecs, User } from '@user/types';
import { UserNotFoundError } from 'src/user/user.error';
import { In, IsNull } from 'typeorm';
import { UserMapper } from '../mapper/user.mapper';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserPersistence> {
  protected model = UserPersistence;

  async findOne(specs: FindUserSpecs) {
    const repo = this.getDBRepository();
    let qb = repo.createQueryBuilder('User');
    if (specs.shouldIncludeDeleted) {
      qb = repo.createQueryBuilder('User').withDeleted();
    }
    // fetch role info
    qb.leftJoinAndSelect('User.roles', 'roles');

    if (specs.userId) {
      qb.andWhere('User.id = :userId', { userId: specs.userId });
    }
    if (specs.email) {
      qb.andWhere('User.email = :email', {
        email: specs.email.toLowerCase(),
      });
    }

    if (specs.roleList) {
      qb.andWhere('roles.role IN (:...roleList)', { roleList: specs.roleList });
    }

    const persistence = await qb.getOne();
    if (!persistence) {
      return new UserNotFoundError();
    }
    return UserMapper.toDomain(persistence);
  }

  async findMany(specs: FindUserSpecs) {
    const repo = this.getDBRepository();
    try {
      const [rows, total] = await repo.findAndCount({
        where: {
          id: specs.userIdList?.length ? In(specs.userIdList) : undefined,
          status: specs.statusList?.length ? In(specs.statusList) : undefined,
          deletedAt: specs.shouldIncludeDeleted ? undefined : IsNull(),
        },
        take: specs.limit,
        skip: specs.offset,
        order: {
          createdAt: 'ASC',
        },
      });
      return {
        data: rows.map(UserMapper.toDomain),
        total,
      } as Pagination<User>;
    } catch (e) {
      return new FailedToGetResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to get users',
      );
    }
  }

  async save(user: User) {
    const persistence = UserMapper.toPersistence(user);
    const repo = this.getDBRepository();
    try {
      const savedUser = await repo.save(persistence);
      return UserMapper.toDomain(savedUser);
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save user',
      );
    }
  }

  async saveMany(users: User[]) {
    const list = users.map(UserMapper.toPersistence);
    const repo = this.getDBRepository();
    try {
      await repo.save(list);
      return true;
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to save user',
      );
    }
  }

  async delete(specs: FindUserSpecs) {
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
        id: specs.userId
          ? specs.userId
          : specs.userIdList
          ? In(specs.userIdList)
          : undefined,
      });
      return deletedResult;
    } catch (e) {
      return new FailedToSaveResourceError(
        'External',
        e?.stack,
        e?.message || 'Failed to delete user',
      );
    }
  }
}
