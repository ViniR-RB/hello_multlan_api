import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IDeleteUserUseCase, {
  DeleteUserParam,
} from '@/modules/users/domain/usecase/i_delete_user_use_case';

export default class DeleteUserService implements IDeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(param: DeleteUserParam): AsyncResult<AppException, Unit> {
    if (param.requestingUserId === param.targetUserId) {
      return left(new ServiceException("You can't delete yourself", 400));
    }

    const userReciveAction = await this.userRepository.findOne({
      userId: param.targetUserId,
    });

    if (userReciveAction.isLeft()) {
      return left(userReciveAction.value);
    }

    const deleteUser = await this.userRepository.delete(param.targetUserId);

    if (deleteUser.isLeft()) {
      return left(deleteUser.value);
    }

    return right(unit);
  }
}
