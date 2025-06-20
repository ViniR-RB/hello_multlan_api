import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import IGetUserByIdUseCase, {
  GetUserByIdParam,
  GetUserByIdResponse,
} from '@/modules/user/domain/usecase/i_get_user_by_id_use_case';
export default class GetUserByIdService implements IGetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    param: GetUserByIdParam,
  ): AsyncResult<ServiceException, GetUserByIdResponse> {
    const userFinderResult = await this.userRepository.findOneById(
      param.userId,
    );

    if (userFinderResult.isLeft()) {
      return left(new ServiceException(userFinderResult.value.message, 404));
    }

    return right(GetUserByIdResponse.fromEntity(userFinderResult.value));
  }
}
