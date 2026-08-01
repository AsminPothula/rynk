import { FindAuthSpecs } from '@auth/types';
import {
  IntegrationEvent,
  SetPasswordResentEvent,
  UserPasswordUpdatedEvent,
} from '@events';
import { Injectable } from '@nestjs/common';
import { EventService } from '@shared';
import { AppError } from '@types';
import {
  PasswordTokenExpiredError,
  PasswordTokenNotFoundError,
} from '../auth.error';
import { AuthService } from '../auth.service';

@Injectable()
export class SetUserPasswordUseCase {
  constructor(
    private _eventService: EventService,
    private _authService: AuthService,
  ) {}

  async execute(params: { userId: string; token: string; password: string }) {
    const specs = new FindAuthSpecs().setUserId(params.userId);
    const auth = await this._authService.find(specs);
    if (auth instanceof AppError) {
      return auth;
    }
    const result = await auth.setPassword(params);
    if (result instanceof PasswordTokenNotFoundError) {
      return result;
    }
    if (result instanceof PasswordTokenExpiredError) {
      await auth.createPasswordToken();
    }
    await this._authService.save(auth);
    if (result === true) {
      this._eventService.emitIntegrationEvent(
        IntegrationEvent.UserPasswordUpdated,
        new UserPasswordUpdatedEvent(auth.user),
      );
    } else {
      const portalUrl = this._authService.getPortalUrlFor(auth);

      this._eventService.emitIntegrationEvent(
        IntegrationEvent.SetPasswordResent,
        new SetPasswordResentEvent(auth.user, auth.passwordToken, portalUrl),
      );
      return result;
    }
    return true;
  }
}
