import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { useCases } from './initiator';
import { UserRoleService } from './user-role/user-role.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService, UserRoleService],
  imports: [SharedModule],
  providers: [UserService, UserRoleService, ...useCases],
})
export class UserModule {}
