import { left, right } from '@/core/either/either';
import Nil from '@/core/either/nil';
import AppException from '@/core/erros/app.exception';
import ServiceException from '@/core/erros/service.exception';
import { EncryptionService } from '@/core/services/encryption.service';
import { AsyncResult } from '@/core/types/async_result';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import ICreateUserUseCase, {
  CreateUserParams,
  CreateUserResponse,
} from '@/modules/user/domain/usecase/i_create_user_use_case';
import UserEntity from '@/modules/user/domain/user.entity';

export default class CreateUserService implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  async call(
    param: CreateUserParams,
  ): AsyncResult<AppException, CreateUserResponse> {
    const userAlreadyExisties = await this.userRepository.findOneByEmail(
      param.user.email,
    );

    if (userAlreadyExisties.isLeft()) {
      return left(
        new ServiceException(
          userAlreadyExisties.value.message,
          userAlreadyExisties.value.statusCode,
        ),
      );
    }
    if (!(userAlreadyExisties.value instanceof Nil)) {
      return left(new ServiceException('User already exists', 409));
    }

    const hashedPassword = await this.encryptionService.hash(
      param.user.password,
    );

    const userEntity = new UserEntity({
      ...param.user,
      password: hashedPassword,
    });

    const userSaved = await this.userRepository.create(userEntity);

    if (userSaved.isLeft()) {
      return left(
        new ServiceException(
          userSaved.value.message,
          userSaved.value.statusCode,
        ),
      );
    }

    return right(CreateUserResponse.fromEntity(userSaved.value));
  }
}
