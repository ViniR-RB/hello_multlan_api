import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import IUserRepository from '../adapters/i_user_repository';
import IUpdateFirebaseIdUseCase, {
  UpdateFirebaseIdParams,
} from '../domain/usecase/i_update_firebase_id_use_case';
import UserEntity from '../domain/user.entity';

@Injectable()
export default class UpdateFirebaseIdService
  implements IUpdateFirebaseIdUseCase
{
  constructor(private readonly userRepository: IUserRepository) {}

  async call(
    params: UpdateFirebaseIdParams,
  ): Promise<Either<ServiceException, UserEntity>> {
    try {
      const findResult = await this.userRepository.findOneById(params.userId);

      if (findResult.isLeft()) {
        return left(new ServiceException(findResult.value.message, 404));
      }

      const user = findResult.value;
      user.updateFirebaseId(params.firebaseId);

      const updateResult = await this.userRepository.saveUser(user);

      if (updateResult.isLeft()) {
        return left(new ServiceException(updateResult.value.message, 400));
      }

      return right(updateResult.value);
    } catch (error) {
      if (error instanceof ServiceException) {
        return left(error);
      }
      return left(new ServiceException('Unexpected error', 500));
    }
  }
}
