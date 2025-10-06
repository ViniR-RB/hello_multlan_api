import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserRole from '@/modules/users/domain/entities/user_role';
import UserModel from '@/modules/users/infra/models/user.model';
import { UserQueryOptions } from '@/modules/users/infra/query/query_objects';

export default interface IUserRepository
  extends BaseRepository<UserModel, UserEntity> {
  findOne(query: UserQueryOptions): AsyncResult<AppException, UserEntity>;
  findManyByIds(ids: number[]): AsyncResult<AppException, UserEntity[]>;
  findByFilters(
    options: PageOptionsEntity,
    role?: UserRole,
  ): AsyncResult<AppException, PageEntity<UserEntity>>;
}
