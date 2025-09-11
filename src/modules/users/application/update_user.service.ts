import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IUpdateUserUseCase, {
  UpdateUserParam,
  UpdateUserResponse,
} from '@/modules/users/domain/usecase/i_update_user_use_case';

export default class UpdateUserService implements IUpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    param: UpdateUserParam,
  ): AsyncResult<AppException, UpdateUserResponse> {
    try {
      const userFinder = await this.userRepository.findOne({
        userId: param.userId,
      });
      if (userFinder.isLeft()) {
        return left(userFinder.value);
      }
      const user = userFinder.value;
      user.updateUser({
        name: param.name,
        email: param.email,
        fcmToken: param.fcmToken,
      });
      const userSaved = await this.userRepository.save(user);
      if (userSaved.isLeft()) {
        return left(userSaved.value);
      }
      return right(new UpdateUserResponse(userSaved.value));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
