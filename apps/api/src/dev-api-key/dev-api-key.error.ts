import { AppError, AppErrorType } from '@types';

export class DevApiKeyNotFoundError extends AppError {
  static _type = AppErrorType.DevApiKeyNotFoundError;
  readonly _message = 'Error getting dev api key';
}
