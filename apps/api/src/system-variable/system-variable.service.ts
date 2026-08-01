import { Injectable } from '@nestjs/common';
import { SystemVariableRepository } from '@shared';
import { AppError } from '@types';
import {
  FindSystemVariableSpecs,
  SystemVariable,
  SystemVariableType,
} from './system-variable.types';

@Injectable()
export class SystemVariableService {
  constructor(private _systemVariableRepo: SystemVariableRepository) {}

  async save(product: SystemVariable) {
    const saveResult = await this._systemVariableRepo.save(product);
    return saveResult;
  }

  async saveMany(products: SystemVariable[]) {
    const saveResult = await this._systemVariableRepo.saveMany(products);
    return saveResult;
  }

  async find(spec: FindSystemVariableSpecs) {
    const getResult = await this._systemVariableRepo.findOne(spec);
    return getResult;
  }

  async findMany(spec: FindSystemVariableSpecs) {
    const getResult = await this._systemVariableRepo.findMany(spec);
    return getResult;
  }

  async getAllSystemVariables() {
    const variableSpecs = new FindSystemVariableSpecs();
    const variables = await this.findMany(variableSpecs);
    if (variables instanceof AppError) {
      return variables;
    }
    return variables;
  }

  async getSystemVariable(systemVariable: SystemVariableType) {
    const variableSpecs = new FindSystemVariableSpecs().setName(systemVariable);
    return await this.find(variableSpecs);
  }
}
