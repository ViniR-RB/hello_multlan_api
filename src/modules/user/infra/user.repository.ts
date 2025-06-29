import { AsyncResult } from '@/core/types/async_result';
import UserMapper from '@/modules/user/infra/model/user_mapper';
import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import IUserRepository from '../adapters/i_user_repository';
import UserEntity from '../domain/user.entity';
import UserModel from './model/user.model';

export default class UserRepository implements IUserRepository {
  constructor(private readonly userRepository: Repository<UserModel>) {}
  async saveUser(
    userEntity: UserEntity,
  ): AsyncResult<RepositoryException, UserEntity> {
    try {
      const userModel = this.userRepository.create(
        UserMapper.toModel(userEntity),
      );

      await this.userRepository.save(userModel);

      return right(UserMapper.toEntity(userModel));
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return left(
          new RepositoryException(
            `Erro ao salvar o usuário: ${userEntity.userId}`,
          ),
        );
      }
      return left(new RepositoryException('Erro ao salvar o usuário'));
    }
  }
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
      const usersList = usersModelList.map(user => UserMapper.toEntity(user));
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
      const userFinder = await this.userRepository.findOneByOrFail({ id: id });
      return right(UserMapper.toEntity(userFinder));
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return left(new RepositoryException('Usuário não econtrado'));
      }
      return left(new RepositoryException('Usuário não econtrado'));
    }
  }
  async findOneByEmail(
    email: string,
  ): Promise<Either<RepositoryException, UserEntity | Nil>> {
    try {
      const userModel = await this.userRepository.findOneByOrFail({ email });

      return right(UserMapper.toEntity(userModel));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return right(nil);
      }
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
