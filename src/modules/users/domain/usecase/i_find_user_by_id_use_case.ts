import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';

export default interface IFindUserByIdUseCase
  extends UseCase<FindUserByIdParam, FindUserByIdResponse> {}

export interface FindUserByIdParam {
  userId: number;
}

export class FindUserByIdResponse {
  constructor(private readonly user: UserEntity) {}

  fromResponse() {
    return this.user.toObject();
  }
}
