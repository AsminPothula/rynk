import { Auth } from '@auth/types';
import { Injectable } from '@nestjs/common';
import { AppError } from '@types';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginUserUseCase {
  constructor(private _authService: AuthService) {}

  async execute(auth: Auth) {
    const result = auth.checkLogin();
    if (result instanceof AppError) {
      return result;
    }

    return this._authService._login(auth);
  }
}
