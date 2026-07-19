import { Api, DecodedJwt } from '@decorator';
import { Body, Controller, Param, Query } from '@nestjs/common';
import { AppError, UserPermission } from '@types';
import { AuthDetail } from '@user/types';
import { CronService } from 'src/shared/cron/cron.service';
import {
  ChangePasswordDto,
  CheckEmailResponse,
  ForgotPasswordDto,
  RefreshTokenDto,
  SetUserPasswordDto,
  SignInDto,
  SignInResponse,
  SignUpDto,
  SignUpResponse,
  SuperAdminOnboardDto,
} from './auth.dto';
import {
  AuthNotFoundError,
  SameAsOneOfPreviousPasswordsError,
  WrongPasswordError,
} from './auth.error';
import { Auth } from './auth.type';
import { SignInEndpoint, SignedInAuth } from './auth.util';
import {
  ChangeUserPasswordUseCase,
  CheckEmailUseCase,
  CreateSystemAdminUseCase,
  ForgotUserPasswordUseCase,
  LoginUserUseCase,
  RefreshUserTokenUseCase,
  ResendEmailVerificationUseCase,
  SetUserPasswordUseCase,
  SignUpUserUseCase,
  VerifyEmailUseCase,
} from './initiator';
import { SignUpCustomerUseCase } from './initiator/SignUpCustomerUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private _setPasswordUseCase: SetUserPasswordUseCase,
    private _loginUserUseCase: LoginUserUseCase,
    private _signUpUserUseCase: SignUpUserUseCase,
    private _changeUserPasswordUseCase: ChangeUserPasswordUseCase,
    private _forgotUserPasswordUseCase: ForgotUserPasswordUseCase,
    private _refreshUserTokenUseCase: RefreshUserTokenUseCase,
    private _createSystemAdminUseCase: CreateSystemAdminUseCase,
    private _verifyEmailUseCase: VerifyEmailUseCase,
    private _resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
    private _signUpCustomerUseCase: SignUpCustomerUseCase,
    private _checkEmailUseCase: CheckEmailUseCase,
    private _cronService: CronService,
  ) {}

  // Email Validation
  @Api({
    isPublic: true,
    verb: 'GET',
    path: 'check-email/:email',
    swaggerSuccessResponse: CheckEmailResponse,
  })
  async checkEmail(@Param('email') email: string) {
    const result = await this._checkEmailUseCase.execute({ email });
    if (result instanceof AppError) {
      throw result;
    }
    return new CheckEmailResponse(result);
  }

  // Authentication - Sign Up
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'sign-up/password',
    swaggerSuccessResponse: SignUpResponse,
  })
  async signUp(@Body() data: SignUpDto) {
    const result = await this._signUpUserUseCase.execute(data);
    if (result instanceof AppError) {
      throw result;
    }
    // NOTE: Don't send any response as we shouldn't let  login into portal before owner accepts the request
    // return new SignUpResponse(result.id);
  }

  // Authentication - Sign In
  @SignInEndpoint()
  @Api({
    isPublic: true,
    swaggerRequestBody: {
      type: SignInDto,
    },
    verb: 'POST',
    path: 'sign-in/password',
    swaggerSuccessResponse: SignInResponse,
  })
  async signIn(@SignedInAuth() auth: Auth): Promise<SignInResponse> {
    const result = await this._loginUserUseCase.execute(auth);
    if (result instanceof AppError) {
      throw result;
    }
    return new SignInResponse(
      result.accessToken,
      result.refreshToken,
      result.userId,
    );
  }

  // Token Management
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'refresh-token',
    swaggerSuccessResponse: SignInResponse,
  })
  async refreshToken(@Body() data: RefreshTokenDto): Promise<SignInResponse> {
    const result = await this._refreshUserTokenUseCase.execute(data);
    if (result instanceof AppError) {
      throw result;
    }
    return new SignInResponse(
      result.accessToken,
      result.refreshToken,
      result.userId,
    );
  }

  // Password Management
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'set-password',
    swaggerSuccessResponse: null,
  })
  async setUserPassword(@Body() data: SetUserPasswordDto) {
    const result = await this._setPasswordUseCase.execute(data);
    if (result instanceof AppError) {
      throw result;
    }
  }

  @Api({
    hasPermission: UserPermission.ManageUser,
    isPublic: false,
    verb: 'POST',
    path: 'change-password',
    swaggerSuccessResponse: null,
    swaggerRequestErrors: [
      AuthNotFoundError,
      WrongPasswordError,
      SameAsOneOfPreviousPasswordsError,
    ],
  })
  async changePassword(
    @Body() data: ChangePasswordDto,
    @DecodedJwt() payload: AuthDetail,
  ) {
    const result = await this._changeUserPasswordUseCase.execute({
      userId: payload.userId,
      data,
    });
    if (result instanceof AppError) {
      throw result;
    }
  }

  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'forgot-password',
    swaggerSuccessResponse: null,
  })
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const result = await this._forgotUserPasswordUseCase.execute(data);
    if (result instanceof AppError) {
      throw result;
    }
  }

  // Email Verification
  @Api({
    isPublic: true,
    verb: 'GET',
    path: 'verify-email',
    swaggerSuccessResponse: String,
  })
  async verifyEmail(
    @Query('token') token: string,
    @Query('userId') userId: string,
    @Query('email') email: string,
  ) {
    const result = await this._verifyEmailUseCase.execute({
      token,
      userId,
      email,
    });
    if (result instanceof AppError) {
      // throw result;
      // NOTE: Show the text to user on UI instead of throwing error
      return 'Failed to verify email. Token has expired.';
    }
    return 'Email verified successfully';
  }

  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'resend-verify-email',
    swaggerSuccessResponse: null,
  })
  async resendVerifyEmail(@Query('email') email: string) {
    const result = await this._resendEmailVerificationUseCase.execute({
      email,
    });
    if (result instanceof AppError) {
      throw result;
    }
  }

  // Admin Management
  @Api({
    isPublic: true,
    verb: 'POST',
    path: 'admin/onboard-system-admin',
    swaggerSuccessResponse: SignUpResponse,
  })
  async onboardSystemAdmin(@Body() data: SuperAdminOnboardDto) {
    const result = await this._createSystemAdminUseCase.execute({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
    if (result instanceof AppError) {
      throw result;
    }
    await this._cronService.createCronJobLocks();
    return new SignUpResponse(result.user.id);
  }
}
