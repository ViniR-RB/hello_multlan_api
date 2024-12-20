import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import { EntityNotFoundError, Repository } from 'typeorm';
import IUserRepository from '../adapters/i_user_repository';
import UserEntity from '../domain/user.entity';
import UserModel from './model/user.model';
import { AsyncResult } from '@/core/types/async_result';

export default class UserRepository implements IUserRepository {
  constructor(private readonly userRepository: Repository<UserModel>) {}
  async updatePassword(
    userEntity: UserEntity,
  ): AsyncResult<RepositoryException, Nil> {
    try {
      const userData = {
        password: userEntity.userPassword,
      };
      await this.userRepository.update(userEntity.userId, userData);

      return right(nil);
    } catch (error) {
      return left(
        new RepositoryException(
          `Erro em Modificar a senha do usuário:${userEntity.userId}`,
        ),
      );
    }
  }
  async findAll(): AsyncResult<RepositoryException, Array<UserEntity>> {
    try {
      const usersModelList = await this.userRepository.find();
      const usersList = usersModelList.map((user) => user.toEntity());
      return right(usersList);
    } catch (error) {
      return left(
        new RepositoryException('Houve um Problema em Buscar Todos os Usuário'),
      );
    }
  }
  async findOneById(
    id: string,
  ): Promise<Either<RepositoryException, UserEntity>> {
    try {
      const userFinder = await this.userRepository.findOneBy({ id: id });
      return right(userFinder.toEntity());
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return left(new RepositoryException('Usuário não econtrado'));
      }
    }
  }
  async findOneByEmail(
    email: string,
  ): Promise<Either<RepositoryException, UserEntity>> {
    try {
      return right((await this.userRepository.findOneBy({ email })).toEntity());
    } catch (error) {
      return left(new RepositoryException('Error to find user by email'));
    }
  }
  async create(user: UserEntity): Promise<Either<RepositoryException, Nil>> {
    try {
      const data = {
        id: user.userId,
        name: user.userName,
        email: user.userEmail,
        password: user.userPassword,
      };
      await this.userRepository.save(this.userRepository.create(data));
      return right(nil);
    } catch (error) {
      return left(new RepositoryException('Error to create user'));
    }
  }
}
