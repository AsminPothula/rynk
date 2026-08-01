import { AppError, AppErrorType } from '@types';

export class RunNotFoundError extends AppError {
  static _type = AppErrorType.RunNotFoundError;
  readonly _message = 'Run not found';
}
