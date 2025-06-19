import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import IUpdateUserUseCase, {
  UpdateUserParam,
  UpdateUserResponse,
} from '@/modules/user/domain/usecase/i_update_user_use_case';
import UserDomainException from '@/modules/user/exceptions/user_domain.exception';

export default class UpdateUserService implements IUpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    param: UpdateUserParam,
  ): AsyncResult<ServiceException, UpdateUserResponse> {
    try {
      const userForUpdateResult = await this.userRepository.findOneById(
        param.userId,
      );

      if (userForUpdateResult.isLeft()) {
        return left(new ServiceException('User not found', 404));
      }

      const userForUpdate = userForUpdateResult.value;

      userForUpdate.updateUserInformation(param.userUpdateData);
      this.userRepository.saveUser(userForUpdate);
      return right(UpdateUserResponse.response());
    } catch (error) {
      if (error instanceof UserDomainException) {
        return left(new ServiceException(error.message, error.statusCode));
      }
    }
  }
}
