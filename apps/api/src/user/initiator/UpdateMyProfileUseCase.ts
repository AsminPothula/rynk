import { isValidPhoneNumber } from '@helper';
import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { FindUserSpecs } from '@user/types';
import { InvalidPhoneNumberError } from '../user.error';
import { UserService } from '../user.service';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(private _userService: UserService) {}

  async execute(params: {
    firstName: string;
    lastName: string;
    userId: string;
    phone: string;
  }) {
    const { firstName, lastName, userId, phone } = params;

    const modifiedPhone = phone.replace(/[^+\d]/g, '');
    if (modifiedPhone && !isValidPhoneNumber(modifiedPhone)) {
      return new InvalidPhoneNumberError();
    }

    const specs = new FindUserSpecs().setUserId(userId);
    const user = await this._userService.find(specs);
    if (user instanceof AppError) {
      return user;
    }
    const result = user.updateMyProfile({
      firstName,
      lastName,
      phone: modifiedPhone,
    });

    if (result instanceof AppError) {
      return result;
    }
    return await this._userService.save(user);
  }
}
