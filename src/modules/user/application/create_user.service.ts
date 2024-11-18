import { Either, left, right } from '@/core/either/either';
import Nil, { nil } from '@/core/either/nil';
import ServiceException from '@/core/erros/service.exception';
import { EncryptionService } from '@/core/services/encryption.service';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import ICreateUserUseCase, {
  CreateUserParams,
} from '@/modules/user/domain/usecase/i_create_user_use_case';
import UserEntity from '@/modules/user/domain/user.entity';

export default class CreateUserService implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  async call(user: CreateUserParams): Promise<Either<ServiceException, Nil>> {
    const { email, password } = user;
    const userFinder = await this.userRepository.findOneByEmail(email);
    if (userFinder.isRight()) {
      return left(new ServiceException('User already exists', 400));
    }
    const hashedPassword = await this.encryptionService.hash(password);
    const userEntity = new UserEntity({
      ...user,
      password: hashedPassword,
    });
    const resultSaveUser = await this.userRepository.create(userEntity);
    if (resultSaveUser.isLeft()) {
      return left(new ServiceException(resultSaveUser.value.message, 500));
    }
    return right(nil);
  }
}
