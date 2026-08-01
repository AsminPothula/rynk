import { ForbiddenError, UserNotFoundError } from '@error';
import { Injectable } from '@nestjs/common';
import { AppError, UserProfileRole } from '@types';
import { FindUserSpecs } from '@user/types';
import { UserService } from '../user.service';

@Injectable()
export class UpdateOtherProfileUseCase {
  constructor(private _userService: UserService) {}

  async execute(params: {
    firstName: string;
    lastName: string;
    userId: string;
    actorId: string;
  }) {
    const { firstName, lastName, userId, actorId } = params;

    const userSpecs = new FindUserSpecs().setUserId(userId);
    const actorSpecs = new FindUserSpecs().setUserId(actorId);
    const [user, actor] = await Promise.all([
      this._userService.find(userSpecs),
      this._userService.find(actorSpecs),
    ]);
    if (user instanceof AppError || actor instanceof AppError) {
      return new UserNotFoundError();
    }

    const actorRoles = (actor.roles || []).map((role) => role.role);
    if (!actorRoles.includes(UserProfileRole.SystemAdmin)) {
      return new ForbiddenError();
    }

    user.setFirstName(firstName).setLastName(lastName);

    const result = await this._userService.save(user);

    return result;
  }
}
