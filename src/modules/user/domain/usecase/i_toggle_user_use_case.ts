import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UserEntity from '@/modules/user/domain/user.entity';

export default interface IToggleUserUseCase {
  execute(
    param: ToggleUserParam,
  ): AsyncResult<ServiceException, ToggleUserResponse>;
}

export class ToggleUserParam {
  constructor(public readonly userId: string) {}
}

export class ToggleUserResponse {
  static fromEntity(userEntity: UserEntity) {
    const { password, ...rest } = userEntity.toObject();
    return {
      ...rest,
    };
  }
}
