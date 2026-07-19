import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource, QueryRunner } from 'typeorm';
import { RequestScope } from 'nj-request-scope';
import { AppError } from '@types';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
@RequestScope()
export class TransactionHelper {
  private _manager: EntityManager | null;

  get manager() {
    return this._manager;
  }

  get queryRunner() {
    return this._manager?.queryRunner ?? null;
  }

  constructor(private _dataSource: DataSource) {}

  async start<T>(
    cb: () => Promise<T>,
    isolationLevel?: IsolationLevel,
  ): Promise<T> {
    let queryRunner: QueryRunner | undefined = undefined;
    try {
      if (this.isInTransaction()) {
        return await cb();
      }
      queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.startTransaction(isolationLevel);
      this._manager = queryRunner.manager;
      const result = await cb();
      if (result instanceof AppError) {
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
      return result;
    } catch (e) {
      if (queryRunner?.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw e;
    } finally {
      await queryRunner?.release();
    }
  }

  isInTransaction() {
    return !!this._manager?.queryRunner?.isTransactionActive ?? false;
  }
}
