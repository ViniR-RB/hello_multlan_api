import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UserEntity from '@/modules/user/domain/user.entity';

export default interface IGetUserByIdUseCase {
  execute(
    param: GetUserByIdParam,
  ): AsyncResult<ServiceException, GetUserByIdResponse>;
}

export class GetUserByIdParam {
  constructor(public readonly userId: string) {}
}

export class GetUserByIdResponse {
  static fromEntity(user: UserEntity) {
    const { password, ...rest } = user.toObject();
    return rest;
  }
}
