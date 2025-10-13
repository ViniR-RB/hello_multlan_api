import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';

export default interface IToggleUserUseCase
  extends UseCase<ToggleUserParam, ToggleUserResponse> {}

export interface ToggleUserParam {
  targetUserId: number;
  requestingUserId: number;
}

export class ToggleUserResponse {
  constructor(public readonly user: UserEntity) {}

  fromResponse() {
    return this.user.toObject();
  }
}
