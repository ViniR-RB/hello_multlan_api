import CoreModule from '@/core/core_module';
import {
  EncryptionService,
  IEncryptionService,
} from '@/core/services/encryption.service';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import CreateUserService from '@/modules/users/application/create_user.service';
import UpdateUserService from '@/modules/users/application/update_user.service';
import UserModel from '@/modules/users/infra/models/user.model';
import UserRepository from '@/modules/users/infra/repositories/user.repository';
import {
  CREATE_USER_SERVICE,
  UPDATE_USER_SERVICE,
  USER_REPOSITORY,
} from '@/modules/users/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([UserModel])],
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
