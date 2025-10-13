import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserRole from '@/modules/users/domain/entities/user_role';
import {
  UserRepositoryException,
  UserRepositoryNotFoundException,
} from '@/modules/users/exceptions/user_repository.exception';
import UserMapper from '@/modules/users/infra/mapper/user.mapper';
import UserModel from '@/modules/users/infra/models/user.model';
import { UserQueryOptions } from '@/modules/users/infra/query/query_objects';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOneOptions, In, Repository } from 'typeorm';

export default class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  async findByFilters(
    options: PageOptionsEntity,
    email?: string,
    role?: UserRole,
  ): AsyncResult<AppException, PageEntity<UserEntity>> {
    try {
      let queryBuilder = this.userRepository.createQueryBuilder('user');

      if (role) {
        queryBuilder = queryBuilder.where('user.role = :role', { role });
      }

      if (email) {
        queryBuilder = queryBuilder.andWhere('user.email ILIKE :email', {
          email: `%${email}%`,
        });
      }

      queryBuilder
        .orderBy('user.createdAt', options.order)
        .skip(options.skip)
        .take(options.take);

      const [users, total] = await queryBuilder.getManyAndCount();
      const pageMeta = new PageMetaEntity({
        pageOptions: options,
        itemCount: total,
      });

      return right(new PageEntity(users.map(UserMapper.toEntity), pageMeta));
    } catch (e) {
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }

  create(entity: UserEntity): UserModel {
    return this.userRepository.create(UserMapper.toModel(entity));
  }
  async findManyByIds(ids: number[]): AsyncResult<AppException, UserEntity[]> {
    try {
      const users = await this.userRepository.findBy({
        id: In(ids),
      });
      return right(users.map(UserMapper.toEntity));
    } catch (error) {
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async findOne(
    query: UserQueryOptions,
  ): AsyncResult<AppException, UserEntity> {
    try {
      let options: FindOneOptions<UserModel> = {
        select: query.selectFields,
      };

      if (query.userEmail) {
        options = {
          ...options,
          where: { email: query.userEmail },
        };
      }
      if (query.userId) {
        options = {
          ...options,
          where: { id: query.userId },
        };
      }
      const userFinder = await this.userRepository.findOneOrFail(options);

      return right(UserMapper.toEntity(userFinder));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(new UserRepositoryNotFoundException());
      }

      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async save(user: UserEntity): AsyncResult<AppException, UserEntity> {
    try {
      const userModel = this.create(user);

      await this.userRepository.save(userModel);

      return right(UserMapper.toEntity(userModel));
    } catch (error) {
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
