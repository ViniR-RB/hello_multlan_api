import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import { IEncryptionService } from '@/core/services/encryption.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IUpdateMyPasswordUseCase, {
  UpdateMyPasswordParam,
} from '@/modules/users/domain/usecase/i_update_my_password_use_case';

export default class UpdateMyPasswordService
  implements IUpdateMyPasswordUseCase
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
  ) {}

  async execute(param: UpdateMyPasswordParam): AsyncResult<AppException, Unit> {
    const userFinder = await this.userRepository.findOne({
      userId: param.userId,
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

    const matchPasswords = await this.encryptionService.isMatch(
      user.password,
      param.oldPassword,
    );

    if (!matchPasswords) {
      return left(new ServiceException('Old password does not match', 401));
    }

    const hashedPassword = await this.encryptionService.hashString(
      param.newPassword,
    );

    user.updatePassword(hashedPassword);

    const userUpdated = await this.userRepository.save(user);
    if (userUpdated.isLeft()) {
      return left(userUpdated.value);
    }

    return right(unit);
  }
}
