import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { FindUserSpecs } from '@user/types';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from '../../user/user.service';
import { FailedToVerifyEmailError } from '../auth.error';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
  ) {}

  async execute({ token }: { token: string; email: string; userId: string }) {
    try {
      const decoded = await this._authService.verifyEmailVerificationToken(
        token,
      );
      const personId = decoded.sub;
      // TODO: Additional check for email verification token?
      const specs = new FindUserSpecs().setUserId(personId);
      const user = await this._userService.find(specs);

      if (user instanceof AppError) {
        return user;
      }

      if (user.isEmailVerified) {
        return true;
      }
      user.setEmailVerified(true);
      const result = await this._userService.save(user);
      if (result instanceof AppError) {
        return result;
      }

      return true;
    } catch (e) {
      return new FailedToVerifyEmailError();
    }
  }
}
