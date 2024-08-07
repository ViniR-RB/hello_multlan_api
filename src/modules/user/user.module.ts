import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core_module';
import { EncryptionService } from 'src/core/services/encryption.service';
import { Repository } from 'typeorm';
import IUserRepository from './adapters/i_user_repository';
import CreateUserService from './application/create_user.service';
import UserModel from './infra/model/user.model';
import UserRepository from './infra/user.repository';
import { CREATE_USER_SERVICE, USER_REPOSITORY } from './symbols';
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
      provide: CREATE_USER_SERVICE,
      inject: [USER_REPOSITORY, EncryptionService],
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: EncryptionService,
      ) => new CreateUserService(userRepository, encryptionService),
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
      provide: USER_REPOSITORY,
      inject: [getRepositoryToken(UserModel)],
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
  ],
})
export default class UserModule {}
