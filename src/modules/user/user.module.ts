import GetUserByIdService from '@/modules/user/application/get_user_by_id.service';
import ToggleUserService from '@/modules/user/application/toggle_user.service';
import UpdateUserService from '@/modules/user/application/update_user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core_module';
import { EncryptionService } from 'src/core/services/encryption.service';
import { Repository } from 'typeorm';
import IUserRepository from './adapters/i_user_repository';
import CreateUserService from './application/create_user.service';
import UpdateFirebaseIdService from './application/update_firebase_id.service';
import UserModel from './infra/model/user.model';
import UserRepository from './infra/user.repository';
import {
  CREATE_USER_SERVICE,
  GET_USER_BY_ID_SERVICE,
  TOGGLE_USER_SERVICE,
  UPDATE_FIREBASE_ID_SERVICE,
  UPDATE_USER_SERVICE,
  USER_REPOSITORY,
} from './symbols';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), CoreModule],

  controllers: [],
  providers: [
    {
      provide: USER_REPOSITORY,
      inject: [getRepositoryToken(UserModel)],
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
    {
      provide: UPDATE_USER_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new UpdateUserService(userRepository),
    },
    {
      provide: CREATE_USER_SERVICE,
      inject: [USER_REPOSITORY, EncryptionService],
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: EncryptionService,
      ) => new CreateUserService(userRepository, encryptionService),
    },
    {
      provide: GET_USER_BY_ID_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new GetUserByIdService(userRepository),
    },
    {
      provide: TOGGLE_USER_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new ToggleUserService(userRepository),
    },
    {
      provide: UPDATE_FIREBASE_ID_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new UpdateFirebaseIdService(userRepository),
    },
  ],
  exports: [
    {
      provide: CREATE_USER_SERVICE,
      inject: [USER_REPOSITORY, EncryptionService],
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: EncryptionService,
      ) => new CreateUserService(userRepository, encryptionService),
    },
    {
      provide: UPDATE_USER_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new UpdateUserService(userRepository),
    },
    {
      provide: USER_REPOSITORY,
      inject: [getRepositoryToken(UserModel)],
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
    {
      provide: GET_USER_BY_ID_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new GetUserByIdService(userRepository),
    },
    {
      provide: TOGGLE_USER_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new ToggleUserService(userRepository),
    },
    {
      provide: UPDATE_FIREBASE_ID_SERVICE,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository: IUserRepository) =>
        new UpdateFirebaseIdService(userRepository),
    },
  ],
})
export default class UserModule {}
