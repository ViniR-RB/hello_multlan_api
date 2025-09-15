import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserRole from '@/modules/users/domain/entities/user_role';

export default interface ICreateUserUseCase
  extends UseCase<CreateUserParam, CreateUserResponse> {}

export interface CreateUserParam {
  name: string;
  email: string;
  password: string;
  fcmToken: string | null;
  role: UserRole;
}

export class CreateUserResponse {
  constructor(public readonly userEntity: UserEntity) {}

  fromResponse() {
    return {
      ...this.userEntity.toObject(),
      password: undefined,
    };
  }
}
