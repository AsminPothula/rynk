import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { UpdateSystemVariablesDTO } from '../system-variable.dto';
import { SystemVariableService } from '../system-variable.service';
import {
  FindSystemVariableSpecs,
  SystemVariable,
} from '../system-variable.types';

@Injectable()
export class UpdateSystemVariableUseCase {
  constructor(private _systemVariableService: SystemVariableService) {}

  async execute(params: UpdateSystemVariablesDTO) {
    const systemVariablesMap = new Map<string, string>();
    for (const [key, value] of Object.entries(params)) {
      systemVariablesMap.set(key, value);
    }

    const variableSpecs = new FindSystemVariableSpecs();
    const variablesResult = await this._systemVariableService.findMany(
      variableSpecs,
    );
    if (variablesResult instanceof AppError) {
      return variablesResult;
    }
    const variables: SystemVariable[] = [];
    for (const systemVariableEntry of systemVariablesMap.entries()) {
      const systemVariable = variablesResult.data.find(
        (variable) => variable.name === systemVariableEntry[0],
      );
      if (systemVariable) {
        systemVariable.setValue(systemVariableEntry[1]);
        variables.push(systemVariable);
      } else {
        const systemVariable = SystemVariable.create({
          name: systemVariableEntry[0],
          value: systemVariableEntry[1],
        });
        variables.push(systemVariable);
      }
    }
    return await this._systemVariableService.saveMany(variables);
  }
}
