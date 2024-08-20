import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core_module';
import { EncryptionService } from 'src/core/services/encryption.service';
import JsonWebTokenService from 'src/core/services/json_web_token.service';
import IUserRepository from '../user/adapters/i_user_repository';
import { USER_REPOSITORY } from '../user/symbols';
import UserModule from '../user/user.module';
import LoginUserService from './application/login_user.service';
import RefreshTokensService from './application/refresh_tokens.service';
import ShowMyUserService from './application/show_my_user.service';
import AuthController from './controller/auth.controller';
import {
  LOGIN_USER_SERVICE,
  REFRESH_TOKENS_SERVICE,
  SHOW_MY_USER_SERVICE,
} from './symbols';
@Module({
  imports: [UserModule, CoreModule],

  controllers: [AuthController],
  providers: [
    {
      inject: [USER_REPOSITORY, EncryptionService, JsonWebTokenService],
      provide: LOGIN_USER_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: EncryptionService,
        jsonWebTokenService: JsonWebTokenService,
      ) =>
        new LoginUserService(
          userRepository,
          encryptionService,
          jsonWebTokenService,
        ),
    },
    {
      inject: [USER_REPOSITORY],
      provide: SHOW_MY_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new ShowMyUserService(userRepository),
    },
    {
      inject: [USER_REPOSITORY, JsonWebTokenService],
      provide: REFRESH_TOKENS_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        jsonWebTokenService: JsonWebTokenService,
      ) => new RefreshTokensService(userRepository, jsonWebTokenService),
    },
  ],
  exports: [],
})
export default class AuthModule {}
