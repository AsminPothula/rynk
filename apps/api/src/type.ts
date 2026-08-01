import { ApiProperty } from '@nestjs/swagger';

export type Pagination<T> = {
  data: T[];
  total: number;
};

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

export type StatusType = `${Status}`;

export enum UserPermission {
  ManageAssets = 'MA',
  ManageDesigns = 'MD',
  ApproveDesigns = 'AD',
  ManageUser = 'MU',
  /** Create / edit rynk clients and their onboarding profile (ClientContext). */
  ManageClient = 'MC',
}
export type UserPermissionType = `${UserPermission}`;

export enum UserProfileRole {
  Admin = 'admin',
  Developer = 'developer',
  SystemAdmin = 'systemadmin',
}
export type UserProfileRoleType = `${UserProfileRole}`;

// TODO: Add more permissions, if needed
export const AllPermissions = [
  UserPermission.ManageUser,
  UserPermission.ManageClient,
];
export const AdminPermissions = [
  UserPermission.ManageUser,
  UserPermission.ManageClient,
];
export const DeveloperPermissions = [UserPermission.ManageAssets];
export const SystemPermissions = AllPermissions;

export interface FileUploadData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export type Constructor<I> = new (...args: any[]) => I;

export abstract class AppError {
  static _type: AppErrorType;
  protected _message: string;

  @ApiProperty({
    type: 'string',
  })
  get message() {
    return this._message;
  }

  @ApiProperty({
    type: 'string',
    enum: AppErrorType,
    enumName: 'ErrorType',
  })
  get type() {
    return (this.constructor as any)._type;
  }

  constructor(
    readonly source: 'Application' | 'External' = 'Application',
    readonly stack?: any,
  ) {}
}

// TODO: Remove all design studio related errors
export enum AppErrorType {
  UserNotFoundError = 'UserNotFound',
  AuthNotFoundError = 'AuthNotFound',
  RoleNotFoundError = 'RoleNotFound',
  FailedToGetResourceError = 'FailedToGetResource',
  FailedToSaveResourceError = 'FailedToSaveResource',
  SystemAdminUserExistsError = 'SystemAdminUserExists',
  BadRequestError = 'BadRequest',
  InvalidPasswordError = 'InvalidPassword',
  UserExistsWithEmailError = 'UserExistsWithEmail',
  PasswordTokenNotFoundError = 'PasswordTokenNotFound',
  PasswordTokenExpiredError = 'PasswordTokenExpired',
  WrongPasswordError = 'WrongPassword',
  SameAsOneOfPreviousPasswordsError = 'SameAsOneOfPreviousPasswords',
  PermissionsRequiredError = 'PermissionsRequired',
  InvalidPermissionNameError = 'InvalidPermissionName',
  InvalidPermissionForUserTypeError = 'InvalidPermissionForUserType',
  UserNotActiveError = 'UserNotActive',
  AuthNotActiveError = 'AuthNotActive',
  RoleNotActiveError = 'RoleNotActive',
  RefreshTokenExpiredOrNotActiveError = 'RefreshTokenExpiredOrNotActive',
  UserIsNotEligibleForInvitationError = 'UserIsNotEligibleForInvitation',
  CannotDeactivateInvitedUserError = 'CannotDeactivateInvitedUser',
  CannotDeactivateDeactivatedUserError = 'CannotDeactivateDeactivatedUser',
  CannotDeactivateInactiveUserError = 'CannotDeactivateInactiveUser',
  CannotDeactivateRequestedUserError = 'CannotDeactivateRequestedUser',
  ForbiddenError = 'Forbidden',
  UnauthorizedError = 'Unauthorized',
  RefreshTokenBlockedError = 'RefreshTokenBlocked',
  InvalidEmailValidationError = 'InvalidEmail',
  InvalidIntValidationError = 'InvalidInt',
  InvalidDecimalValidationError = 'InvalidDecimal',
  InvalidNumberValidationError = 'InvalidNumber',
  MinNumberValidationError = 'MinNumber',
  MaxNumberValidationError = 'MaxNumber',
  NotMatchingRegexValidationError = 'NotMatchingRegex',
  NotOneOfValuesValidationError = 'NotOneOfValues',
  InvalidDateValidationError = 'InvalidDate',
  InvalidStringValidationError = 'InvalidString',
  InvalidBoolValidationError = 'InvalidBool',
  InvalidValueValidationError = 'InvalidValue',
  MinStringLengthValidationError = 'MinStringLength',
  MaxStringLengthValidationError = 'MaxStringLength',
  MediaFileNotFoundError = 'MediaFileNotFound',
  MediaFileInvalidError = 'MediaFileInvalid',
  FileTypeNotSupportedError = 'FileTypeNotSupported',
  MediaFileTypeMetaDataNotFoundError = 'MediaFileTypeMetaDataNotFound',
  MediaFileFailedToProcessError = 'MediaFileFailedToProcess',
  InternalServerError = 'InternalServerError',
  AWSHeadObjectNotFoundError = 'AWSHeadObjectNotFoundError',
  InvalidEnumValidationError = 'InvalidEnumValidationError',
  AWSObjectNotFoundError = 'AWSObjectNotFoundError',
  ServiceError = 'ServiceError',
  InvalidDateRangeError = 'InvalidDateRangeError',
  CronJobLockSetUpError = 'CronJobLockSetUpError',
  InvalidPhoneNumberError = 'InvalidPhoneNumberError',
  UserNotSystemAdmin = 'UserNotSystemAdmin',
  CannotReactivateInvitedUserError = 'CannotReactivateInvitedUserError',
  CannotReactivateActiveUserError = 'CannotReactivateActiveUserError',
  CannotReactivateRequestedUserError = 'CannotReactivateRequestedUserError',
  FailedToUploadFileError = 'FailedToUploadFileError',
  FailedToStreamFileError = 'FailedToStreamFileError',
  PortalAccessDeniedError = 'PortalAccessDeniedError',
  FailedToVerifyEmailError = 'FailedToVerifyEmailError',
  CannotResendEmailVerificationError = 'CannotResendEmailVerificationError',
  EmailAlreadyVerifiedError = 'EmailAlreadyVerifiedError',
  EmailNotVerifiedError = 'EmailNotVerifiedError',
  EmailAlreadyExistsError = 'EmailAlreadyExistsError',
  UserNotGuestError = 'UserNotGuestError',
  UserNotGuestCannotResetPasswordError = 'UserNotGuestCannotResetPasswordError',
  UserNotAssociatedWithAccountError = 'UserNotAssociatedWithAccountError',
  DuplicateResourceInputValidationError = 'DuplicateResourceInputValidationError',
  FailedToFetchJsonFromS3Error = 'FailedToFetchJsonFromS3Error',
  DevApiKeyNotFoundError = 'DevApiKeyNotFoundError',
  DuplicateUploadError = 'DuplicateUploadError',
  OutdatedOutputVersionError = 'OutdatedOutputVersionError',
  AccountNotFoundError = 'AccountNotFoundError',
  AccountAlreadyAssociatedError = 'AccountAlreadyAssociatedError',
  DataUploadFailedError = 'DataUploadFailedError',
  SystemVariableNotFoundError = 'SystemVariableNotFoundError',
  TypeValidationError = 'TypeValidationError',
  FailedToGetConfigFileError = 'FailedToGetConfigFileError',
  ClientNotFoundError = 'ClientNotFoundError',
  ClientAlreadyExistsError = 'ClientAlreadyExistsError',
  ClientNotOnboardedError = 'ClientNotOnboardedError',
  RunNotFoundError = 'RunNotFoundError',
  PipelineFailedError = 'PipelineFailedError',
}

export const AppErrorTypeValues = Object.values(AppErrorType).filter((item) => {
  return isNaN(Number(item));
});

export enum RescaleMode {
  contain = 'contain',
  cover = 'cover',
}

export enum UserSearchStatus {
  All = 'All',
  Active = 'Active',
  Deactivated = 'Deactivated',
  Inactive = 'Inactive',
  Invited = 'Invited',
  Requested = 'Requested',
  Uploaded = 'Uploaded',
}

export enum FileType {
  Video = 'video',
  Image = 'image',
  Audio = 'audio',
  GLB = 'glb',
  PDF = 'pdf',
  Other = 'other',
  Json = 'json',
  Zip = 'zip',
  Font = 'font',
}

// TODO: Add more sign up modes
export enum SignUpMode {
  Guest = 'guest',
}
export type SignUpModeType = `${SignUpMode}`;

export enum DevApiKeyPermissions {
  UpdateSystemVariables = 'USV',
  UploadDataMigration = 'MTD',
}
export type DevApiKeyPermissionsType = `${DevApiKeyPermissions}`;
