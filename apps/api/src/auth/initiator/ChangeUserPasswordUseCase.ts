import { FindAuthSpecs } from '@auth/types';
import { IntegrationEvent, UserPasswordUpdatedEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService } from '@shared';
import { AppError } from '@types';
import { ChangePasswordDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private _authService: AuthService,
    private _eventService: EventService,
  ) {}

  async execute(params: { userId: string; data: ChangePasswordDto }) {
    const specs = new FindAuthSpecs().setUserId(params.userId);
    const auth = await this._authService.find(specs);
    if (auth instanceof AppError) {
      return auth;
    }
    const result = await auth.changePassword(params.data);
    if (result instanceof AppError) {
      return result;
    }
    await this._authService.save(auth);
    this._eventService.emitIntegrationEvent(
      IntegrationEvent.UserPasswordUpdated,
      new UserPasswordUpdatedEvent(auth.user),
    );
    return true;
  }
}
