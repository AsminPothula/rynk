import { AppError, AppErrorType } from '@types';

export class UserNotFoundError extends AppError {
  static _type = AppErrorType.UserNotFoundError;
  protected _message = 'User is not found';
}

export class InvalidPhoneNumberError extends AppError {
  static _type = AppErrorType.InvalidPhoneNumberError;
  readonly _message = 'Phone number is not valid';
}

export class UserNotActiveError extends AppError {
  static _type = AppErrorType.UserNotActiveError;
  protected _message = 'User is not active';
}

export class CannotDeactivateInvitedUserError extends AppError {
  static _type = AppErrorType.CannotDeactivateInvitedUserError;
  protected _message = 'Cannot deactivate the invited user. Check user status';
}

export class CannotDeactivateDeactivatedUserError extends AppError {
  static _type = AppErrorType.CannotDeactivateDeactivatedUserError;
  protected _message =
    'Cannot deactivate the deactivated user. Check user status';
}

export class CannotDeactivateInactiveUserError extends AppError {
  static _type = AppErrorType.CannotDeactivateInactiveUserError;
  protected _message = 'Cannot deactivate the inactive user. Check user status';
}

export class CannotDeactivateRequestedUserError extends AppError {
  static _type = AppErrorType.CannotDeactivateRequestedUserError;
  protected _message =
    'Cannot deactivate the requested user. Check user status';
}

export class CannotReactivateActiveUserError extends AppError {
  static _type = AppErrorType.CannotReactivateActiveUserError;
  protected _message = 'Cannot reactivate the active user. Check user status';
}

export class CannotReactivateInactiveUserError extends AppError {
  static _type = AppErrorType.CannotDeactivateInactiveUserError;
  protected _message = 'Cannot reactivate the inactive user. Check user status';
}

export class CannotReactivateRequestedUserError extends AppError {
  static _type = AppErrorType.CannotReactivateRequestedUserError;
  protected _message =
    'Cannot reactivate the requested user. Check user status';
}

export class CannotReactivateInvitedUserError extends AppError {
  static _type = AppErrorType.CannotReactivateInvitedUserError;
  protected _message = 'Cannot reactivate the invited user. Check user status';
}

export class UserIsNotEligibleForInvitationError extends AppError {
  static _type = AppErrorType.UserIsNotEligibleForInvitationError;
  protected _message = 'User is not eligible for invitation';
}

export class SystemAdminUserExistsError extends AppError {
  static _type = AppErrorType.SystemAdminUserExistsError;
  protected _message = 'System admin already exists';
}
