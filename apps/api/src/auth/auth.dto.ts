import {
  REGEX,
  SAMPLE_BOOL,
  SAMPLE_FIRST_NAME,
  SAMPLE_JWT,
  SAMPLE_LAST_NAME,
  SAMPLE_PHONE,
  SAMPLE_UUID,
} from '@constant';
import { DtoProperty, ResponseProperty } from '@decorator';

export class SignInDto {
  @DtoProperty({
    type: 'Email',
  })
  email: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
  })
  password: string;
}

export class ForgotPasswordDto {
  @DtoProperty({
    type: 'Email',
  })
  email: string;
}

export class SetUserPasswordDto {
  @DtoProperty({
    type: 'UUID',
    errorMessage: 'User ID is required',
  })
  userId: string;

  @DtoProperty({
    type: 'UUID',
    errorMessage: 'Token is required',
  })
  token: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
  })
  password: string;
}

export class ChangePasswordDto {
  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
  })
  oldPassword: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
  })
  newPassword: string;
}

export class RefreshTokenDto {
  @DtoProperty({
    type: 'String',
    isNotEmpty: true,
    swaggerSampleValue: SAMPLE_JWT,
  })
  refreshToken: string;
}

export class SuperAdminOnboardDto {
  @DtoProperty({
    type: 'Email',
  })
  email: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
  })
  password: string;

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
    swaggerSampleValue: SAMPLE_PHONE,
  })
  phone: string;
}

export class SignUpDto {
  @DtoProperty({
    type: 'Email',
  })
  email: string;

  @DtoProperty({
    type: 'String',
    swaggerSampleValue: 'Jane',
    isNotEmpty: true,
  })
  firstName: string;

  @DtoProperty({
    type: 'String',
    swaggerSampleValue: 'Doe',
    isNotEmpty: true,
  })
  lastName: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PHONE,
    swaggerSampleValue: SAMPLE_PHONE,
    errorMessage: 'Phone number is invalid',
  })
  phone: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
    isNotEmpty: true,
  })
  password: string;
}

export class SignInResponse {
  @ResponseProperty(SAMPLE_JWT) readonly accessToken: string;
  @ResponseProperty(SAMPLE_JWT) readonly refreshToken: string;
  @ResponseProperty(SAMPLE_UUID) readonly userId: string;
  constructor(accessToken: string, refreshToken: string, userId: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }
}

export class SignUpResponse {
  @ResponseProperty(SAMPLE_UUID) readonly userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
}

export class SignUpCustomerDto {
  @DtoProperty({
    type: 'Email',
  })
  email: string;

  @DtoProperty({
    type: 'String',
  })
  accountId: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PASSWORD,
    isNotEmpty: true,
  })
  password: string;

  @DtoProperty({
    type: 'Regex',
    matches: REGEX.PHONE,
    swaggerSampleValue: SAMPLE_PHONE,
    errorMessage: 'Phone number is invalid',
  })
  phone: string;

  @DtoProperty({
    type: 'String',
  })
  firstName: string;

  @DtoProperty({
    type: 'String',
  })
  lastName: string;
}

export class CheckEmailResponse {
  @ResponseProperty(SAMPLE_BOOL) readonly isCustomerSignUp: boolean;
  constructor(result: boolean) {
    this.isCustomerSignUp = result ?? false;
  }
}
