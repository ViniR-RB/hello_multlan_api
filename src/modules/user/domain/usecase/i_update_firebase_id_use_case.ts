import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import UserEntity from '../user.entity';

export default interface IUpdateFirebaseIdUseCase {
  call(
    params: UpdateFirebaseIdParams,
  ): Promise<Either<ServiceException, UserEntity>>;
}

export class UpdateFirebaseIdParams {
  userId: string;
  firebaseId: string;

  constructor(userId: string, firebaseId: string) {
    this.userId = userId;
    this.firebaseId = firebaseId;
  }
}
