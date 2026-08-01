import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { FindUserSpecs } from '@user/types';
import { UserNotFoundError } from '../user.error';
import { UserService } from '../user.service';

@Injectable()
export class ReactivateUserUseCase {
  constructor(private _userService: UserService) {}

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
    const reactivated = actor.reactivate(user);
    if (reactivated instanceof AppError) {
      return reactivated;
    }
    return await this._userService.save(user);
  }
}
