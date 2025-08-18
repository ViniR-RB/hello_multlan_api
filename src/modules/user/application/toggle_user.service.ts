import { left, right } from '@/core/either/either';
import AppException from '@/core/erros/app.exception';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import IToggleUserUseCase, {
  ToggleUserParam,
  ToggleUserResponse,
} from '@/modules/user/domain/usecase/i_toggle_user_use_case';

export default class ToggleUserService implements IToggleUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async call(
    param: ToggleUserParam,
  ): AsyncResult<AppException, ToggleUserResponse> {
    const userFinderResult = await this.userRepository.findOneById(
      param.userId,
    );

    if (userFinderResult.isLeft()) {
      return left(new ServiceException('User not found', 404));
    }
    userFinderResult.value.toggleUser();

    const userSaved = await this.userRepository.saveUser(
      userFinderResult.value,
    );

    if (userSaved.isLeft()) {
      return left(new ServiceException('Error saving user', 500));
    }

    return right(ToggleUserResponse.fromEntity(userFinderResult.value));
  }
}
