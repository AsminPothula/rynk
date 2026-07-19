import { Injectable } from '@nestjs/common';
import { DataSource, QueryBuilder } from 'typeorm';
import { TransactionHelper } from '../helper';

@Injectable()
export class BaseRepository<T extends object> {
  protected model: { new (): T };

  constructor(
    private _dataSource: DataSource,
    private _transactionHelper: TransactionHelper,
  ) {}

  async startQueryRunner(cb: (queryBuilder: QueryBuilder<T>) => Promise<void>) {
    const queryRunner =
      this._transactionHelper.queryRunner ||
      this._dataSource.createQueryRunner();
    const queryBuilder =
      this._transactionHelper.manager?.createQueryBuilder() ??
      this._dataSource.createQueryBuilder();
    queryBuilder.setQueryRunner(queryRunner);
    try {
      await cb(queryBuilder);
    } catch {}
    await queryRunner.release();
  }

  getDBRepository() {
    const repository = this._dataSource.getRepository<T>(this.model);
    if (
      this._transactionHelper.isInTransaction() &&
      this._transactionHelper.manager
    ) {
      return this._transactionHelper.manager.withRepository(repository);
    }
    return repository;
  }
}
