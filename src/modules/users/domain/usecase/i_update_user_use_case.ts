import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';

export default interface IUpdateUserUseCase
  extends UseCase<UpdateUserParam, UpdateUserResponse> {}

export interface UpdateUserParam {
  userId: number;
  name?: string;
  email?: string;
  fcmToken?: string | null;
}

export class UpdateUserResponse {
  constructor(public readonly userEntity: UserEntity) {}

  fromResponse() {
    return this.userEntity.toObject();
  }
}
