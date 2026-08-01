import { DeactivateUserUseCase } from './DeactivateUserUseCase';
import { ReactivateUserUseCase } from './ReactivateUserUseCase';
import { UpdateMyProfileUseCase } from './UpdateMyProfileUseCase';
import { UpdateOtherProfileUseCase } from './UpdateOtherProfileUseCase';

export const useCases = [
  UpdateMyProfileUseCase,
  DeactivateUserUseCase,
  ReactivateUserUseCase,
  UpdateOtherProfileUseCase,
];

export * from './DeactivateUserUseCase';
export * from './ReactivateUserUseCase';
export * from './UpdateMyProfileUseCase';
export * from './UpdateOtherProfileUseCase';
