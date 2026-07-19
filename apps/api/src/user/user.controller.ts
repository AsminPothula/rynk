import { Api, DecodedJwt } from '@decorator';
import { Body, Controller, Param } from '@nestjs/common';
import { AppError, UserPermission } from '@types';
import {
  DeactivateUserUseCase,
  UpdateMyProfileUseCase,
  UpdateOtherProfileUseCase,
} from './initiator';
import {
  GetProfileResponse,
  UpdateMyProfileDto,
  UpdateUserProfileDto,
} from './user.dto';
import { UserService } from './user.service';
import { AuthDetail } from './user.type';

@Controller('user')
export class UserController {
  constructor(
    private _userService: UserService,
    private _updateMyProfileUseCase: UpdateMyProfileUseCase,
    private _deactivateUserUseCase: DeactivateUserUseCase,
    private _updateOtherProfileUseCase: UpdateOtherProfileUseCase,
  ) {}

  @Api({
    isPublic: false,
    path: 'profile',
    verb: 'GET',
    disableCache: true,
    swaggerSuccessResponse: GetProfileResponse,
  })
  async getMyProfile(@DecodedJwt() payload: AuthDetail) {
    const result = await this._userService.getMyProfile(payload);
    if (result instanceof AppError) {
      throw result;
    }
    return new GetProfileResponse(result);
  }

  @Api({
    isPublic: false,
    path: '/my-profile',
    verb: 'PUT',
    swaggerSuccessResponse: null,
  })
  async updateMyProfile(
    @DecodedJwt() payload: AuthDetail,
    @Body() body: UpdateMyProfileDto,
  ) {
    const result = await this._updateMyProfileUseCase.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      userId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
  }

  @Api({
    hasPermission: UserPermission.ManageUser,
    isPublic: false,
    path: '/:userId/deactivate',
    verb: 'POST',
    swaggerSuccessResponse: null,
  })
  async deactivateUser(
    @DecodedJwt() payload: AuthDetail,
    @Param('userId') userId: string,
  ) {
    const result = await this._deactivateUserUseCase.execute({
      userId,
      actorId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
  }

  @Api({
    isPublic: false,
    path: ':userId/profile',
    verb: 'PUT',
    swaggerSuccessResponse: null,
  })
  async updateOtherProfile(
    @DecodedJwt() payload: AuthDetail,
    @Param('userId') userId: string,
    @Body() body: UpdateUserProfileDto,
  ) {
    const result = await this._updateOtherProfileUseCase.execute({
      userId,
      firstName: body.firstName,
      lastName: body.lastName,
      actorId: payload.userId,
    });
    if (result instanceof AppError) {
      throw result;
    }
  }
}
