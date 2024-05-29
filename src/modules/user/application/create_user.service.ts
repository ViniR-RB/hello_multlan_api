import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import ServiceException from 'src/core/erros/service.exception';
import { EncryptionService } from 'src/core/services/encryption.service';
import IUserRepository from '../adapters/i_user_repository';
import ICreateUserUseCase, {
  CreateUserParams,
} from '../domain/usecase/i_create_user_use_case';
import UserEntity from '../domain/user.entity';

export default class CreateUserService implements ICreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  async call(user: CreateUserParams): Promise<Either<ServiceException, Nil>> {
    const { email, password } = user;
    const userFinder = await this.userRepository.findOneByEmail(email);
    if (userFinder.isRight()) {
      return left(new ServiceException('User already exists', 401));
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
