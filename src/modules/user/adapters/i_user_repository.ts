import { AsyncResult } from '@/core/types/async_result';
import { Either } from 'src/core/either/either';
import Nil from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import UserEntity from '../domain/user.entity';

export default interface IUserRepository {
  create(user: UserEntity): Promise<Either<RepositoryException, Nil>>;
  findOneByEmail(
    email: string,
  ): Promise<Either<RepositoryException, UserEntity>>;
  findOneById(id: string): Promise<Either<RepositoryException, UserEntity>>;
  findAll(): AsyncResult<RepositoryException, Array<UserEntity>>;
  updatePassword(userEntity: UserEntity): AsyncResult<RepositoryException, Nil>;
  saveUser(
    userEntity: UserEntity,
  ): AsyncResult<RepositoryException, UserEntity>;
}
