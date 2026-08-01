import { Auth } from '@auth/types';
import { IntegrationEvent, SystemAdminCreatedEvent } from '@events';
import { Injectable } from '@nestjs/common';
import { EventService, TransactionHelper } from '@shared';
import { AppError, UserProfileRole } from '@types';
import { UserService } from '@user';
import { UserRoleService } from 'src/user/user-role/user-role.service';
import { UserRole } from 'src/user/user-role/user-role.type';
import { SuperAdminOnboardDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class CreateSystemAdminUseCase {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _transactionHelper: TransactionHelper,
    private _userRoleService: UserRoleService,
    private _eventService: EventService,
  ) {}

  async execute(params: SuperAdminOnboardDto) {
    return await this._transactionHelper.start(async () => {
      const admin = await this._userService.createSystemAdmin(params);
      if (admin instanceof AppError) {
        return admin;
      }
      const savedAdmin = await this._userService.save(admin);
      if (savedAdmin instanceof AppError) {
        return savedAdmin;
      }

      const userRole = UserRole.createUserRole({
        userId: savedAdmin.id,
        role: UserProfileRole.SystemAdmin,
      });
      // Create user role
      const savedUserRole = await this._userRoleService.save(userRole);

      if (savedUserRole instanceof AppError) {
        return savedUserRole;
      }

      const auth = await Auth.createNewLoginWithPassword({
        password: params.password,
        user: savedAdmin,
      });
      const result = await this._authService.save(auth);
      const emailVerificationToken =
        await this._authService.generateEmailVerificationToken({
          email: savedAdmin.email,
          userId: savedAdmin.id,
        });
      this._eventService.emitIntegrationEvent(
        IntegrationEvent.UserSuperAdminCreated,
        new SystemAdminCreatedEvent(savedAdmin, emailVerificationToken),
      );
      return result;
    });
  }
}
