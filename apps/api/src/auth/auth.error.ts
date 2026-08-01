import { AppError, AppErrorType } from '@types';

export class AuthNotFoundError extends AppError {
  static _type = AppErrorType.AuthNotFoundError;
  protected _message = 'User is not found';
}

export class RefreshTokenExpiredOrNotActiveError extends AppError {
  static _type = AppErrorType.RefreshTokenExpiredOrNotActiveError;
  protected _message = 'Refresh token has expired or not active yet';

  constructor(stack?: any) {
    super(stack);
  }
}

export class PasswordTokenNotFoundError extends AppError {
  static _type = AppErrorType.PasswordTokenNotFoundError;
  protected _message = 'Set password link is invalid. Please check again.';
}

export class PasswordTokenExpiredError extends AppError {
  static _type = AppErrorType.PasswordTokenExpiredError;
  protected _message =
    'Set password link has expired. Please check your email for new link.';
}

export class InvalidPasswordError extends AppError {
  static _type = AppErrorType.InvalidPasswordError;
  protected _message = 'Password is invalid';
}

export class RefreshTokenBlockedError extends AppError {
  static _type = AppErrorType.RefreshTokenBlockedError;
  protected _message = 'You are not allowed to access this resource.';
}

export class WrongPasswordError extends AppError {
  static _type = AppErrorType.WrongPasswordError;
  protected _message = 'Password is incorrect';
}

export class AuthNotActiveError extends AppError {
  static _type = AppErrorType.UserNotActiveError;
  protected _message = 'User is not active';
}

export class SameAsOneOfPreviousPasswordsError extends AppError {
  static _type = AppErrorType.SameAsOneOfPreviousPasswordsError;
  protected _message =
    'New password cannot be the same as one of 5 previous passwords';
}

export class PortalAccessDeniedError extends AppError {
  static _type = AppErrorType.PortalAccessDeniedError;
  protected _message =
    'User cannot access this portal. Please contact your administrator';
}

export class EmailNotVerifiedError extends AppError {
  static _type = AppErrorType.EmailNotVerifiedError;
  protected _message = 'Please verify your email before proceeding.';
}

export class EmailAlreadyExistsError extends AppError {
  static _type = AppErrorType.EmailAlreadyExistsError;
  protected _message = 'Email already exists';
}

export class UserNotGuestCannotResetPasswordError extends AppError {
  static _type = AppErrorType.UserNotGuestCannotResetPasswordError;
  protected _message = 'Only guest users can reset their password';
}

export class FailedToVerifyEmailError extends AppError {
  static _type = AppErrorType.FailedToVerifyEmailError;
  protected _message = 'Failed to verify email. Token has expired.';
}

export class CannotResendEmailVerificationError extends AppError {
  static _type = AppErrorType.CannotResendEmailVerificationError;
  protected _message = `Please try again in a few minutes`;
}

export class EmailAlreadyVerifiedError extends AppError {
  static _type = AppErrorType.EmailAlreadyVerifiedError;
  protected _message = `Email has already been verified`;
}
