import { SystemVariablePersistence } from '@persistence/system-variable.persistence';
import { SystemVariable } from 'src/system-variable/system-variable.types';

export class SystemVariableMapper {
  static toDomain(data: SystemVariablePersistence): SystemVariable {
    return SystemVariable.create({
      id: data.id,
      name: data.name,
      value: data.value,
    });
  }

  static toPersistence(data: SystemVariable): SystemVariablePersistence {
    const reasons = new SystemVariablePersistence();
    Object.assign(reasons, {
      id: data.id ?? undefined,
      name: data.name ?? undefined,
      value: data.value ?? undefined,
    });
    return reasons;
  }
}
