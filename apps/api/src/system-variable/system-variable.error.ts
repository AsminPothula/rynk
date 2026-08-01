import { AppError, AppErrorType } from '@types';

export class SystemVariableNotFoundError extends AppError {
  static _type = AppErrorType.SystemVariableNotFoundError;
  readonly _message = 'System variable not found';
}
