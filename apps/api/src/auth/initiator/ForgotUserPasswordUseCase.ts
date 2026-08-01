import { FindAuthSpecs } from '@auth/types';
import { ForgotPasswordEvent, IntegrationEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService } from '@shared';
import { AppError } from '@types';
import { ForgotPasswordDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class ForgotUserPasswordUseCase {
  constructor(
    private _authService: AuthService,
    private _eventService: EventService,
  ) {}

  async execute(params: ForgotPasswordDto) {
    const specs = new FindAuthSpecs().setUserEmail(params.email);
    const auth = await this._authService.find(specs);
    if (auth instanceof AppError) {
      return auth;
    }

    const canResetPassword = auth.canResetPassword();
    if (canResetPassword instanceof AppError) {
      return canResetPassword;
    }

    await auth.createPasswordToken();
    await this._authService.save(auth);

    this._eventService.emitIntegrationEvent(
      IntegrationEvent.ForgotPasswordRequest,
      new ForgotPasswordEvent(auth.user, auth.passwordToken),
    );

    return true;
  }
}
