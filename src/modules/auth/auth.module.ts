import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core_module';
import { EncryptionService } from 'src/core/services/encryption.service';
import JsonWebTokenService from 'src/core/services/json_web_token.service';
import IUserRepository from '../user/adapters/i_user_repository';
import { USER_REPOSITORY } from '../user/symbols';
import UserModule from '../user/user.module';
import LoginUserService from './application/login_user.service';
import AuthController from './controller/auth.controller';
import { LOGIN_USER_SERVICE } from './symbols';
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
  ],
  exports: [],
})
export default class AuthModule {}
