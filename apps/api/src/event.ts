// import { Role } from './role/role.type.js';
import { User } from './user/user.type.js';

export enum IntegrationEvent {
  UserSignUp = 'user.signup',
  UserCreated = 'user.created',
  RoleCreated = 'role.created',
  UserPasswordUpdated = 'user.all.passwordupdated',
  ForgotPasswordRequest = 'user.all.forgotpasswordrequest',
  SetPasswordResent = 'user.all.setpasswordresent',
  UserSessionForcedEnd = 'user.session.forcedend',
  UserInvited = 'user.invited',
  UserSuperAdminCreated = 'user.superadmin.created',
  ResendVerifyEmailRequest = 'resend.verify.email.request',
}

export enum NotifyEvent {
  LeadCreationFailed = 'lead.creation.failed',
  LeadCreationSuccess = 'lead.creation.success',
}

export class SystemAdminCreatedEvent {
  constructor(readonly user: User, readonly emailVerificationToken: string) {}
}

export class LeadCreationFailedEvent {
  constructor(
    readonly email: string,
    readonly userName: string,
    readonly userEmail: string,
    readonly timestamp: Date,
  ) {}
}

export enum DomainEvent {
  DeleteUserAuth = 'user.auth.delete',
  DeleteRole = 'role.delete',
}

// Every other user besides system admin will need to set password upon invited

export class UserSignUpEvent {
  constructor(readonly user: User, readonly emailVerificationToken: string) {}
}

export class UserPasswordUpdatedEvent {
  constructor(readonly user: User) {}
}

export class ForgotPasswordEvent {
  constructor(readonly user: User, readonly passwordToken: string | null) {}
}

export class SetPasswordResentEvent {
  constructor(
    readonly user: User,
    readonly passwordToken: string | null,
    readonly portalUrl: string,
  ) {}
}

export class UserSessionForcedEndEvent {
  constructor(readonly user: User) {}
}

export class ResendVerifyEmailRequestEvent {
  constructor(readonly user: User, readonly emailVerificationToken: string) {}
}
