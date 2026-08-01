import { FindAuthSpecs } from '@auth/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheKey, CacheService } from '@shared';
import { AppError } from '@types';
import { RefreshTokenDto } from '../auth.dto';
import {
  RefreshTokenBlockedError,
  RefreshTokenExpiredOrNotActiveError,
} from '../auth.error';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshUserTokenUseCase {
  constructor(
    private _authService: AuthService,
    private _jwtService: JwtService,
    private _cacheService: CacheService,
  ) {}

  async execute(params: RefreshTokenDto) {
    try {
      const refreshTokenRes = await this._jwtService.verifyAsync(
        params.refreshToken,
      );
      const userId = refreshTokenRes.sub;
      const refreshTokenBlockedBeforeTimestamp =
        await this._cacheService.get<number>(
          CacheKey.RefreshTokenBlacklistTimestamp(userId),
        );
      if (
        refreshTokenBlockedBeforeTimestamp &&
        refreshTokenBlockedBeforeTimestamp / 1000 > refreshTokenRes.iat
      ) {
        return new RefreshTokenBlockedError();
      }
      const specs = new FindAuthSpecs().setUserId(userId);
      const auth = await this._authService.find(specs);
      if (auth instanceof AppError) {
        return auth;
      }
      return this._authService._login(auth);
    } catch (e) {
      return new RefreshTokenExpiredOrNotActiveError(e?.stack);
    }
  }
}
