import { AppError, AppErrorType } from '@types';
export * from './auth/auth.error';
export * from './user/user.error';

export class FailedToGetResourceError extends AppError {
  static _type = AppErrorType.FailedToGetResourceError;
  protected _message = 'Please try again later';

  constructor(
    source: 'Application' | 'External' = 'External',
    stack?: any,
    message?: string,
  ) {
    super(source, new Error());
    this._message = message || this._message;
  }
}

export class FailedToSaveResourceError extends AppError {
  static _type = AppErrorType.FailedToSaveResourceError;
  protected _message = 'Please try again later';

  constructor(
    source: 'Application' | 'External' = 'External',
    stack?: any,
    messge?: string,
  ) {
    super(source, stack);
    this._message = messge || this._message;
  }
}

export class BadRequestError extends AppError {
  static _type = AppErrorType.BadRequestError;
  protected _message = 'Please check request again';
}

export class UserExistsWithEmailError extends AppError {
  static _type = AppErrorType.UserExistsWithEmailError;
  protected _message = 'This email is already in the system';
}

export class UnauthorizedError extends AppError {
  static _type = AppErrorType.UnauthorizedError;
  protected _message = 'You are not allowed to access this resource.';
}

export class CronJobLockSetupError extends AppError {
  static _type = AppErrorType.CronJobLockSetUpError;
  readonly _message = 'Cron job lock is not setup';
}

export class FileTypeNotSupportedError extends AppError {
  readonly _type = AppErrorType.FileTypeNotSupportedError;
  readonly _message = 'File type is not supported';
}

export class MediaFileInvalidError extends AppError {
  readonly _type = AppErrorType.MediaFileInvalidError;
  readonly _message = 'MediaFile is not valid';
}

export class MediaFileTypeMetaDataNotFoundError extends AppError {
  readonly _type = AppErrorType.MediaFileTypeMetaDataNotFoundError;
  readonly _message = 'MediaFile metadata not found';
}

export class ForbiddenError extends AppError {
  static _type = AppErrorType.ForbiddenError;
  protected _message = 'You are not permitted to perform this action.';
}

export class InternalServerError extends AppError {
  static _type = AppErrorType.InternalServerError;
  protected _message = 'Something went wrong in our end. Please report this.';
}

/* Input Validation Errors */

export class InvalidBoolValidationError extends AppError {
  static _type = AppErrorType.InvalidBoolValidationError;
  protected _message = 'Input value has to be a boolean.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidDateValidationError extends AppError {
  static _type = AppErrorType.InvalidDateValidationError;
  protected _message = 'Input has to be a valid date.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidDecimalValidationError extends AppError {
  static _type = AppErrorType.InvalidDecimalValidationError;
  protected _message = 'A decimal is required.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidEmailValidationError extends AppError {
  static _type = AppErrorType.InvalidEmailValidationError;
  protected _message = 'Email is invalid.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidIntValidationError extends AppError {
  static _type = AppErrorType.InvalidIntValidationError;
  protected _message = 'An integer is required.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidNumberValidationError extends AppError {
  static _type = AppErrorType.InvalidNumberValidationError;
  protected _message = 'A number is required.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidEnumValidationError extends AppError {
  static _type = AppErrorType.InvalidEnumValidationError;
  protected _message = 'Input value has to be a enum.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class InvalidStringValidationError extends AppError {
  static _type = AppErrorType.InvalidStringValidationError;
  protected _message = 'Input has to be a string.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class MinStringLengthValidationError extends AppError {
  static _type = AppErrorType.MinStringLengthValidationError;

  constructor(value: number) {
    super();
    this._message = `Input has to be longer than ${value} character(s)`;
  }
}

export class MaxStringLengthValidationError extends AppError {
  static _type = AppErrorType.MaxStringLengthValidationError;

  constructor(value: number) {
    super();
    this._message = `Input has to be shorter than ${value} character(s)`;
  }
}

export class InvalidValueValidationError extends AppError {
  static _type = AppErrorType.InvalidValueValidationError;
  protected _message = 'Input value is not valid.';

  constructor(errorMessage?: string) {
    super();
    this._message = errorMessage
      ? `${this._message}${errorMessage}. `
      : this._message;
  }
}

export class MaxNumberValidationError extends AppError {
  static _type = AppErrorType.MaxNumberValidationError;

  constructor(value: number) {
    super();
    this._message = `Input has to be smaller than ${value}`;
  }
}

export class MinNumberValidationError extends AppError {
  static _type = AppErrorType.MinNumberValidationError;

  constructor(value: number) {
    super();
    this._message = `Input has to be greater than ${value}`;
  }
}

export class NotMatchingRegexValidationError extends AppError {
  static _type = AppErrorType.NotMatchingRegexValidationError;

  constructor(value: RegExp, message?: string) {
    super();
    this._message = message
      ? message
      : `Input does not match regex ${value.toString()}`;
  }
}

export class NotOneOfValuesValidationError extends AppError {
  static _type = AppErrorType.NotOneOfValuesValidationError;

  constructor(value: any[], errorMessage?: string) {
    super();
    this._message = `Input has to be one of ${value
      .map((v) => v.toString())
      .join(', ')}.${errorMessage ? errorMessage : ''}.`;
  }
}

/* Service Errors */

export class ServiceError extends AppError {
  static _type = AppErrorType.ServiceError;
  readonly _message = 'Service error. Please contact us';
}

export class FailedToFetchJsonFromS3Error extends AppError {
  readonly _type = AppErrorType.FailedToFetchJsonFromS3Error;
  readonly _message = 'Failed to fetch JSON from S3';
}
