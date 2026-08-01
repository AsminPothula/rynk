import { AppError, AppErrorType } from '@types';

export class ClientNotFoundError extends AppError {
  static _type = AppErrorType.ClientNotFoundError;
  readonly _message = 'Client not found';
}

export class ClientAlreadyExistsError extends AppError {
  static _type = AppErrorType.ClientAlreadyExistsError;
  readonly _message = 'A client for this domain already exists';
}

export class ClientNotOnboardedError extends AppError {
  static _type = AppErrorType.ClientNotOnboardedError;
  readonly _message =
    'Client has no onboarding profile yet — onboard it before editing';
}

export class PipelineFailedError extends AppError {
  static _type = AppErrorType.PipelineFailedError;
  protected _message = 'Pipeline execution failed';

  constructor(message?: string) {
    super('External');
    this._message = message || this._message;
  }
}
