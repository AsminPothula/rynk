import {
  SAMPLE_EMAIL,
  SAMPLE_FIRST_NAME,
  SAMPLE_LAST_NAME,
  SAMPLE_PHONE,
  SAMPLE_ROLE,
  SAMPLE_UUID,
} from '@constant';
import { DtoProperty, ResponseProperty } from '@decorator';
import { UserRole } from './user-role/user-role.type';
import { User, UserStatus, UserStatusType } from './user.type';

export class GetAdminListData {
  @ResponseProperty(SAMPLE_UUID)
  readonly id: string;

  @ResponseProperty(SAMPLE_FIRST_NAME)
  readonly firstName: string;

  @ResponseProperty(SAMPLE_LAST_NAME)
  readonly lastName: string;

  @ResponseProperty(SAMPLE_EMAIL)
  readonly email: string;

  @ResponseProperty(UserStatus.Active, {
    enum: UserStatus,
    enumName: 'UserStatus',
  })
  readonly status: UserStatusType;
}

export class UpdateMyProfileDto {
  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: SAMPLE_FIRST_NAME,
  })
  firstName: string;

  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: SAMPLE_LAST_NAME,
  })
  lastName: string;

  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    isOptional: true,
    swaggerSampleValue: SAMPLE_PHONE,
  })
  phone: string;
}

export class GetUserRoleResponse {
  @ResponseProperty(SAMPLE_UUID)
  readonly userRoleId: string;

  @ResponseProperty(SAMPLE_FIRST_NAME)
  readonly role: string;

  constructor(userRole: UserRole) {
    this.userRoleId = userRole.id;
    this.role = userRole.role;
  }
}

export class GetProfileResponse {
  @ResponseProperty(SAMPLE_UUID)
  readonly id: string;

  @ResponseProperty(SAMPLE_FIRST_NAME)
  readonly firstName: string;

  @ResponseProperty(SAMPLE_LAST_NAME)
  readonly lastName: string;

  @ResponseProperty(SAMPLE_EMAIL)
  readonly email: string;

  @ResponseProperty(SAMPLE_PHONE, {
    type: 'string',
    nullable: true,
  })
  readonly phone: string | null;

  @ResponseProperty(UserStatus.Active, {
    enum: UserStatus,
    enumName: 'UserStatus',
  })
  readonly status: UserStatusType;

  @ResponseProperty(true, {
    type: 'boolean',
    nullable: false,
  })
  readonly isGuest: boolean;

  @ResponseProperty(true, {
    type: 'boolean',
    nullable: false,
  })
  readonly isEmailVerified: boolean;

  @ResponseProperty(
    [
      {
        id: SAMPLE_UUID,
        role: SAMPLE_ROLE,
      },
    ],
    { type: GetUserRoleResponse, isArray: true, required: true },
  )
  readonly roles: GetUserRoleResponse[];

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.status = user.status;
    this.phone = user.phone;
    this.roles = (user.roles || [])
      // TODO: Remove this filter
      .filter((role) => role.deletedAt === null)
      .map((role) => new GetUserRoleResponse(role));

    this.isEmailVerified = user.isEmailVerified;
    this.isGuest = user.isGuest;
  }
}

export class UpdateUserProfileDto {
  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: SAMPLE_FIRST_NAME,
  })
  firstName: string;

  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: SAMPLE_LAST_NAME,
  })
  lastName: string;
}
