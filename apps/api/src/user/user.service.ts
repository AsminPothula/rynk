import { UserExistsWithEmailError } from '@error';
import { IntegrationEvent, UserPasswordUpdatedEvent } from '@events';
import { LogService } from '@logger';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventService, UserRepository } from '@shared';
import {
  AppError,
  SignUpMode,
  SignUpModeType,
  UserProfileRole,
  UserProfileRoleType,
} from '@types';
import { UserRoleService } from './user-role/user-role.service';
import { UserRole } from './user-role/user-role.type';
import { SystemAdminUserExistsError, UserNotFoundError } from './user.error';
import { FindUserSpecs, User } from './user.type';

@Injectable()
export class UserService {
  private _logger = new LogService(UserService.name);

  constructor(
    private _userRepo: UserRepository,
    private _eventService: EventService,
    private _userRoleService: UserRoleService,
  ) {}

  async createSystemAdmin(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    const { email, lastName, firstName, phone } = params;

    // const { id: roleId } = roleResponse;
    const roleId = UserProfileRole.SystemAdmin;

    // Check if user already exists with system admin role in User table
    const specs = new FindUserSpecs().setRoleList([roleId]);
    const superAdmin = await this.find(specs);
    if (superAdmin instanceof User) {
      return new SystemAdminUserExistsError();
    }
    const admin = await User.createSystemAdmin({
      firstName,
      lastName,
      email,
      phone,
    });
    return admin;
  }

  async addGuestUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: UserProfileRoleType[];
  }) {
    // Check email already exists with other users in User table
    const userSpecs = new FindUserSpecs()
      .setEmail(params.email)
      .includeDeleted();
    const existingUser = await this.find(userSpecs);

    if (existingUser instanceof User) {
      return new UserExistsWithEmailError();
    }
    return this.createUserAndRole({
      ...params,
      signUpMode: SignUpMode.Guest,
      isGuest: true,
    });
  }

  async addCustomerUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: UserProfileRoleType[];
  }) {
    // Check email already exists with other users in User table
    const userSpecs = new FindUserSpecs()
      .setEmail(params.email)
      .includeDeleted();
    const existingUser = await this.find(userSpecs);

    if (existingUser instanceof User) {
      return new UserExistsWithEmailError();
    }
    return this.createUserAndRole({
      ...params,
      signUpMode: SignUpMode.Guest,
      isGuest: false,
    });
  }

  async find(spec: FindUserSpecs) {
    const getResult = await this._userRepo.findOne(spec);
    return getResult;
  }

  async findMany(spec: FindUserSpecs) {
    const getResult = await this._userRepo.findMany(spec);
    return getResult;
  }

  async save(user: User) {
    const saveResult = await this._userRepo.save(user);
    return saveResult;
  }

  async saveMany(users: User[]) {
    const saveResult = await this._userRepo.saveMany(users);
    return saveResult;
  }

  async delete(spec: FindUserSpecs) {
    const getResult = await this._userRepo.delete(spec);
    return getResult;
  }

  async getMyProfile(params: { userId: string }) {
    const { userId } = params;
    const specs = new FindUserSpecs().setUserId(userId);
    const user = await this.find(specs);
    return user;
  }

  @OnEvent(IntegrationEvent.UserPasswordUpdated)
  async handleUserPasswordUpdatedEvent(payload: UserPasswordUpdatedEvent) {
    const { user } = payload;
    if (user.isPendingOnboard()) {
      user.completeOnboarding();
      await this.save(user);
    }
  }

  async deleteUser(params: { userId: string }) {
    const { userId } = params;
    const specs = new FindUserSpecs().setUserId(userId);
    // Hard delete user
    return await this.delete(specs);
  }

  async guardActorAndUser(userId: string, actorId: string) {
    const userSpecs = new FindUserSpecs().setUserId(userId);
    const actorSpecs = new FindUserSpecs().setUserId(actorId);
    const [user, actor] = await Promise.all([
      this.find(userSpecs),
      this.find(actorSpecs),
    ]);
    if (user instanceof AppError || actor instanceof AppError) {
      return new UserNotFoundError();
    }
    return {
      user,
      actor,
    };
  }

  async createUserAndRole(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    roles: UserProfileRoleType[];
    signUpMode: SignUpModeType;
    isGuest: boolean;
  }) {
    const { firstName, lastName, email, phone, roles, signUpMode, isGuest } =
      params;
    let modifiedPhone = null;
    if (phone) {
      modifiedPhone = phone.replace(/[^+\d]/g, '');
    }
    const user = await User.createNewUser({
      firstName,
      lastName,
      email,
      phone: modifiedPhone,
      signUpMode,
      isGuest,
    });

    const savedUser = await this.save(user);
    if (savedUser instanceof AppError) {
      return savedUser;
    }

    const userRoles = UserRole.createUserRoles({
      userId: user.id,
      roleList: roles,
    });
    // Create user role
    const savedUserRoles = await this._userRoleService.saveMany(userRoles);
    if (savedUserRoles instanceof AppError) {
      return savedUserRoles;
    }

    return savedUser;
  }
}
