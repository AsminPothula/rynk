import { Auth } from '@auth/types';
import { IntegrationEvent, UserSignUpEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService, TransactionHelper } from '@shared';
import { AppError, UserProfileRole } from '@types';
import { UserService } from '@user';
import { SignUpCustomerDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class SignUpCustomerUseCase {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _transactionHelper: TransactionHelper,
    private _eventService: EventService,
  ) {}

  async execute(params: SignUpCustomerDto) {
    const { email, password, phone, firstName, lastName } = params;
    return await this._transactionHelper.start(async () => {
      const user = await this._userService.addCustomerUser({
        firstName,
        lastName,
        email,
        phone: phone as string,
        roles: [UserProfileRole.SystemAdmin], // TODO: Update to required role
      });
      if (user instanceof AppError) {
        return user;
      }
      const auth = await Auth.createNewLoginWithPassword({
        password,
        user,
      });
      const emailVerificationToken =
        await this._authService.generateEmailVerificationToken({
          email,
          userId: user.id,
        });
      const result = await this._authService.save(auth);
      this._eventService.emitIntegrationEvent(
        IntegrationEvent.UserSignUp,
        new UserSignUpEvent(user, emailVerificationToken),
      );
      return result;
    });
  }
}
