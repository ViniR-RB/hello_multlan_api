import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import { IEncryptionService } from '@/core/services/encryption.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IUpdatePasswordUseCase, {
  UpdateMyPasswordParam,
} from '@/modules/users/domain/usecase/i_update_password_use_case';

export default class UpdatePasswordService implements IUpdatePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
  ) {}

  async execute(param: UpdateMyPasswordParam): AsyncResult<AppException, Unit> {
    const isSelfUpdate = param.userAction === param.userChangePassword;

    if (!isSelfUpdate) {
      const requestingUserResult = await this.userRepository.findOne({
        userId: param.userAction,
      });

      if (requestingUserResult.isLeft()) {
        return left(requestingUserResult.value);
      }

      const requestingUser = requestingUserResult.value;

      if (!requestingUser.userHasAdmin()) {
        return left(
          new ServiceException(
            'Only administrators can change passwords of other users',
            403,
          ),
        );
      }
    }

    const userFinder = await this.userRepository.findOne({
      userId: param.userChangePassword,
      selectFields: [
        'id',
        'email',
        'name',
        'password',
        'role',
        'isActive',
        'fcmToken',
        'createdAt',
        'updatedAt',
      ],
    });

    if (userFinder.isLeft()) {
      return left(userFinder.value);
    }

    const user = userFinder.value;

    if (isSelfUpdate) {
      const matchPasswords = await this.encryptionService.isMatch(
        user.password,
        param.oldPassword,
      );

      if (!matchPasswords) {
        return left(new ServiceException('Old password does not match', 401));
      }
    }

    // Hash da nova senha
    const hashedPassword = await this.encryptionService.hashString(
      param.newPassword,
    );

    user.updatePassword(hashedPassword);

    // Salvar usuário atualizado
    const userUpdated = await this.userRepository.save(user);
    if (userUpdated.isLeft()) {
      return left(userUpdated.value);
    }

    return right(unit);
  }
}
