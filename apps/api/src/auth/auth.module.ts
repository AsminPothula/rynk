import { Config } from '@config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '@shared';
import { UserModule } from '@user';
import { DevApiKeyModule } from 'src/dev-api-key/dev-api-key.module';
import { SystemVariableModule } from 'src/system-variable/system-variable.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AuthenticatedGuard,
  JwtStrategy,
  LocalStrategy,
  PermissionGuard,
} from './auth.util';
import { useCases } from './initiator';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.Auth.JwtSecret,
    }),
    SharedModule,
    UserModule,
    HttpModule,
    SystemVariableModule,
    DevApiKeyModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    ...useCases,
  ],
  exports: [AuthService],
})
export class AuthModule {}
