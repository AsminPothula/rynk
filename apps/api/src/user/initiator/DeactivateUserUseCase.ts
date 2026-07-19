import { IntegrationEvent, UserSessionForcedEndEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService } from '@shared';
import { AppError } from '@types';
import { FindUserSpecs } from '@user/types';
import { UserNotFoundError } from '../user.error';
import { UserService } from '../user.service';

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    private _userService: UserService,
    private _eventService: EventService,
  ) {}

  async execute(params: { userId: string; actorId: string }) {
    const { userId, actorId } = params;
    const userSpecs = new FindUserSpecs().setUserId(userId);
    const actorSpecs = new FindUserSpecs().setUserId(actorId);
    const [user, actor] = await Promise.all([
      this._userService.find(userSpecs),
      this._userService.find(actorSpecs),
    ]);
    if (user instanceof AppError || actor instanceof AppError) {
      return new UserNotFoundError();
    }
    // check user status
    const deactivated = actor.deactivate(user);
    if (deactivated instanceof AppError) {
      return deactivated;
    }
    this._eventService.emitIntegrationEvent(
      IntegrationEvent.UserSessionForcedEnd,
      new UserSessionForcedEndEvent(user),
    );
    return await this._userService.save(user);
  }
}
