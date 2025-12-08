import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserRole from '@/modules/users/domain/entities/user_role';

export default interface IUpdateUserUseCase
  extends UseCase<UpdateUserParam, UpdateUserResponse> {}

export interface UpdateUserParam {
  userId: number;
  name?: string;
  email?: string;
  fcmToken?: string | null;
  role?: UserRole;
}

export class UpdateUserResponse {
  constructor(public readonly userEntity: UserEntity) {}

  fromResponse() {
    return this.userEntity.toObject();
  }
}
