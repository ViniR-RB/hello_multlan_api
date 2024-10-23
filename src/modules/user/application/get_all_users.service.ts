import ServiceException from '@/core/erros/service.exception';
import IUserRepository from '../adapters/i_user_repository';
import IGetAllUsersUseCase, {
  GetAllUsersResponse,
} from '../domain/usecase/I_get_all_users_use_case';
import { AsyncResult } from '@/core/types/async_result';
import { left, right } from '@/core/either/either';

export default class GetAllUsersService implements IGetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async call(): AsyncResult<ServiceException, Array<GetAllUsersResponse>> {
    const usersFinder = await this.userRepository.findAll();
    if (usersFinder.isLeft()) {
      return left(new ServiceException(usersFinder.value.message, 400));
    }
    return right(
      usersFinder.value.map((user) => GetAllUsersResponse.fromUserEntity(user)),
    );
  }
}
