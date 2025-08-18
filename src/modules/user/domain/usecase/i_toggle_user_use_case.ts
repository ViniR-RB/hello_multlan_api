import { IUseCase } from '@/core/interfaces/use_case';
import UserEntity from '@/modules/user/domain/user.entity';

export default interface IToggleUserUseCase
  extends IUseCase<ToggleUserParam, ToggleUserResponse> {}

export class ToggleUserParam {
  constructor(public readonly userId: string) {}
}

export class ToggleUserResponse {
  static fromEntity(userEntity: UserEntity) {
    const userObject = userEntity.toObject();
    return {
      ...userObject,
    };
  }
}
