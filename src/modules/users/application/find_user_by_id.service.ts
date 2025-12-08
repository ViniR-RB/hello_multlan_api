import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IFindUserByIdUseCase, {
  FindUserByIdParam,
  FindUserByIdResponse,
} from '@/modules/users/domain/usecase/i_find_user_by_id_use_case';

export default class FindUserByIdService implements IFindUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    param: FindUserByIdParam,
  ): AsyncResult<AppException, FindUserByIdResponse> {
    const userResult = await this.userRepository.findOne({
      userId: param.userId,
    });

    if (userResult.isLeft()) {
      return left(userResult.value);
    }

    return right(new FindUserByIdResponse(userResult.value));
  }
}
