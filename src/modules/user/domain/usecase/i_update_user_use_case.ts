import { unit } from '@/core/either/unit';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UpdateUserDto from '@/modules/user/dto/update_user.dto';

export default interface IUpdateUserUseCase {
  execute(
    param: UpdateUserParam,
  ): AsyncResult<ServiceException, UpdateUserResponse>;
}

export class UpdateUserParam {
  constructor(
    public readonly userUpdateData: UpdateUserDto,
    public readonly userId: string,
  ) {}
}

export class UpdateUserResponse {
  static response() {
    return unit;
  }
}
