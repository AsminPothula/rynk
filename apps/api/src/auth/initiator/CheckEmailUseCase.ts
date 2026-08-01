import { Injectable } from '@nestjs/common';
import { TransactionHelper } from '@shared';
import { UserService } from '@user';
import { FindUserSpecs, User } from '@user/types';
import {
  EmailAlreadyExistsError,
  FailedToVerifyEmailError,
} from '../auth.error';

@Injectable()
export class CheckEmailUseCase {
  constructor(
    private _userService: UserService,
    private _transactionHelper: TransactionHelper,
  ) {}

  async execute({ email }: { email: string }) {
    return await this._transactionHelper.start(async () => {
      try {
        const userSpecs = new FindUserSpecs().setEmail(email);
        const user = await this._userService.find(userSpecs);
        if (user instanceof User) {
          return new EmailAlreadyExistsError();
        }
        return false;
      } catch (e) {
        return new FailedToVerifyEmailError();
      }
    });
  }
}
