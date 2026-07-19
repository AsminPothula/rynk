import { IntegrationEvent, ResendVerifyEmailRequestEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService } from '@shared';
import { AppError } from '@types';
import { FindUserSpecs } from '@user/types';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from '../../user/user.service';
import {
  CannotResendEmailVerificationError,
  EmailAlreadyVerifiedError,
} from '../auth.error';

@Injectable()
export class ResendEmailVerificationUseCase {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _eventService: EventService,
  ) {}

  async execute({ email }: { email: string }) {
    const specs = new FindUserSpecs().setEmail(email);
    const user = await this._userService.find(specs);
    if (user instanceof AppError) {
      return user;
    }

    // Don't resend email verification if already verified or user signed up through salesforce
    if (user.isAlreadyVerified()) {
      return new EmailAlreadyVerifiedError();
    }

    // Don't resend email verification if user requested just a few minutes ago
    if (!user.canResendEmailVerification()) {
      return new CannotResendEmailVerificationError();
    }
    const emailVerificationToken =
      await this._authService.generateEmailVerificationToken({
        email,
        userId: user.id,
      });
    user.setEmailVerified(false);
    user.setVerificationEmailLastSent(new Date());
    const result = await this._userService.save(user);
    if (result instanceof AppError) {
      return result;
    }

    this._eventService.emitIntegrationEvent(
      IntegrationEvent.ResendVerifyEmailRequest,
      new ResendVerifyEmailRequestEvent(user, emailVerificationToken),
    );

    return user;
  }
}
