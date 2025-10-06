import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IFindUsersByFiltersUseCase, {
  FindUsersByFiltersParam,
  FindUsersByFiltersResponse,
} from '@/modules/users/domain/usecase/i_find_users_by_filters_use_case';

export default class FindUsersByFiltersService
  implements IFindUsersByFiltersUseCase
{
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    param: FindUsersByFiltersParam,
  ): AsyncResult<AppException, FindUsersByFiltersResponse> {
    const usersFinder = await this.userRepository.findByFilters(
      param.options,
      param.role,
    );
    if (usersFinder.isLeft()) {
      return left(usersFinder.value);
    }
    return right(new FindUsersByFiltersResponse(usersFinder.value));
  }
}
