import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UserEntity from '../user.entity';

export default interface IGetAllUsersUseCase {
  call(): AsyncResult<ServiceException, Array<GetAllUsersResponse>>;
}
export class GetAllUsersResponse {
  static fromUserEntity(user: UserEntity) {
    const { id, password, ...rest } = user.toObject();
    return {
      id,
      ...rest,
    };
  }
}
