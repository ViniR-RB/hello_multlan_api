import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import { IEncryptionService } from '@/core/services/encryption.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import ICreateUserUseCase, {
  CreateUserParam,
  CreateUserResponse,
} from '@/modules/users/domain/usecase/i_create_user_use_case';
import { UserRepositoryNotFoundException } from '@/modules/users/exceptions/user_repository.exception';

export default class CreateUserService implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
  ) {}
  async execute(
    param: CreateUserParam,
  ): AsyncResult<AppException, CreateUserResponse> {
    try {
      const userExists = await this.userRepository.findOne({
        userEmail: param.email,
      });

      if (userExists.isRight()) {
        return left(
          new ServiceException(ErrorMessages.USER_ALREADY_EXISTS, 409),
        );
      }

      if (
        userExists.isLeft() &&
        !(userExists.value instanceof UserRepositoryNotFoundException)
      ) {
        return left(userExists.value);
      }

      const userEntity = UserEntity.create({ ...param });

      const encryptionPassword = await this.encryptionService.hashString(
        userEntity.password,
      );

      userEntity.changePassword(encryptionPassword);

      const userSavedResult = await this.userRepository.save(userEntity);

      if (userSavedResult.isLeft()) {
        return left(userSavedResult.value);
      }
     
      return right(new CreateUserResponse(userSavedResult.value));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error));
    }
  }
}
