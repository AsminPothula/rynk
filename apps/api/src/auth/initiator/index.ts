import { ChangeUserPasswordUseCase } from './ChangeUserPasswordUseCase';
import { CheckEmailUseCase } from './CheckEmailUseCase';
import { CreateSystemAdminUseCase } from './CreateSystemAdminUseCase';
import { ForgotUserPasswordUseCase } from './ForgotUserPasswordUseCase';
import { LoginUserUseCase } from './LoginUserUseCase';
import { RefreshUserTokenUseCase } from './RefreshUserTokenUseCase';
import { ResendEmailVerificationUseCase } from './ResendEmailVerificationUseCase';
import { SetUserPasswordUseCase } from './SetUserPasswordUseCase';
import { SignUpCustomerUseCase } from './SignUpCustomerUseCase';
import { SignUpUserUseCase } from './SignUpUserUseCase';
import { VerifyEmailUseCase } from './VerifyEmailUseCase';

export const useCases = [
  SetUserPasswordUseCase,
  SignUpUserUseCase,
  CreateSystemAdminUseCase,
  LoginUserUseCase,
  ForgotUserPasswordUseCase,
  ChangeUserPasswordUseCase,
  RefreshUserTokenUseCase,
  VerifyEmailUseCase,
  ResendEmailVerificationUseCase,
  SignUpCustomerUseCase,
  CheckEmailUseCase,
];

export * from './ChangeUserPasswordUseCase';
export * from './CheckEmailUseCase';
export * from './CreateSystemAdminUseCase';
export * from './ForgotUserPasswordUseCase';
export * from './LoginUserUseCase';
export * from './RefreshUserTokenUseCase';
export * from './ResendEmailVerificationUseCase';
export * from './SetUserPasswordUseCase';
export * from './SignUpCustomerUseCase';
export * from './SignUpUserUseCase';
export * from './VerifyEmailUseCase';
