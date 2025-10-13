import CoreModule from '@/core/core_module';
import {
  EncryptionService,
  IEncryptionService,
} from '@/core/services/encryption.service';
import AuthModule from '@/modules/auth/auth.module';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import CreateUserService from '@/modules/users/application/create_user.service';
import FindUsersByFiltersService from '@/modules/users/application/find_users_by_filters.service';
import ToggleUserService from '@/modules/users/application/toggle_user.service';
import UpdateMyPasswordService from '@/modules/users/application/update_my_password.service';
import UpdateUserService from '@/modules/users/application/update_user.service';
import UsersController from '@/modules/users/controller/users.controller';
import UserModel from '@/modules/users/infra/models/user.model';
import UserRepository from '@/modules/users/infra/repositories/user.repository';
import {
  CREATE_USER_SERVICE,
  FIND_USERS_BY_FILTERS_SERVICE,
  TOGGLE_USER_SERVICE,
  UPDATE_MY_PASSWORD_SERVICE,
  UPDATE_USER_SERVICE,
  USER_REPOSITORY,
} from '@/modules/users/symbols';
import { forwardRef, Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([UserModel]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [
    {
      inject: [getRepositoryToken(UserModel)],
      provide: USER_REPOSITORY,
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
    {
      inject: [USER_REPOSITORY, EncryptionService],
      provide: CREATE_USER_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        encryption: IEncryptionService,
      ) => new CreateUserService(userRepository, encryption),
    },
    {
      inject: [USER_REPOSITORY],
      provide: UPDATE_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new UpdateUserService(userRepository),
    },
    {
      inject: [USER_REPOSITORY],
      provide: FIND_USERS_BY_FILTERS_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new FindUsersByFiltersService(userRepository),
    },
    {
      inject: [USER_REPOSITORY, EncryptionService],
      provide: UPDATE_MY_PASSWORD_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: IEncryptionService,
      ) => new UpdateMyPasswordService(userRepository, encryptionService),
    },
    {
      inject: [USER_REPOSITORY],
      provide: TOGGLE_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new ToggleUserService(userRepository),
    },
  ],
  exports: [
    {
      inject: [USER_REPOSITORY, EncryptionService],
      provide: CREATE_USER_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        encryption: IEncryptionService,
      ) => new CreateUserService(userRepository, encryption),
    },
    {
      inject: [getRepositoryToken(UserModel)],
      provide: USER_REPOSITORY,
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
    {
      inject: [USER_REPOSITORY],
      provide: UPDATE_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new UpdateUserService(userRepository),
    },
  ],
})
export default class UsersModule {}
