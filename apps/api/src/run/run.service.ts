import { Injectable } from '@nestjs/common';
import { RunRepository } from '@shared';
import { FindRunSpecs, Run } from './run.types';

@Injectable()
export class RunService {
  constructor(private _runRepo: RunRepository) {}

  async save(run: Run) {
    return this._runRepo.save(run);
  }

  async find(spec: FindRunSpecs) {
    return this._runRepo.findOne(spec);
  }

  async findMany(spec: FindRunSpecs) {
    return this._runRepo.findMany(spec);
  }

  async findById(id: string) {
    return this.find(new FindRunSpecs().setId(id));
  }

  async listForClient(clientId: string) {
    return this.findMany(new FindRunSpecs().setClientId(clientId));
  }
}
