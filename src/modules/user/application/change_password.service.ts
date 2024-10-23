import Nil from '@/core/either/nil';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IChangePasswordUseCase from '../domain/usecase/i_change_password_use_case';
import IUserRepository from '../adapters/i_user_repository';
import { left, right } from '@/core/either/either';
import { EncryptionService } from '@/core/services/encryption.service';

export default class ChangePasswordService implements IChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  async call(
    newPassowrd: string,
    userId: string,
  ): AsyncResult<ServiceException, Nil> {
    const userFinder = await this.userRepository.findOneById(userId);
    if (userFinder.isLeft()) {
      return left(new ServiceException(userFinder.value.message, 404));
    }
    const hashedPassword = await this.encryptionService.hash(newPassowrd);
    userFinder.value.updatePassword(hashedPassword);
    return right(await this.userRepository.updatePassword(userFinder.value));
  }
}
