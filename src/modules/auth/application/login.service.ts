import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import { IEncryptionService } from '@/core/services/encryption.service';
import JsonWebTokenService from '@/core/services/json_web_token.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import AuthTokenEntity from '@/modules/auth/domain/entities/auth_token.entity';
import ILoginUseCase, {
  LoginParam,
  LoginResponse,
} from '@/modules/auth/domain/usecase/i_login_use_case';
import IUserRepository from '@/modules/users/adapters/i_user.repository';

export default class LoginService implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jsonWebTokenService: JsonWebTokenService,
  ) {}
  async execute(param: LoginParam): AsyncResult<AppException, LoginResponse> {
    try {
      const userFinder = await this.userRepository.findOne({
        userEmail: param.email,
        selectFields: ['id', 'password', 'name', 'email', 'isActive'],
      });

      if (userFinder.isLeft()) {
        return left(userFinder.value);
      }

      if (!userFinder.value.isActive) {
        return left(
          new ServiceException(ErrorMessages.USER_IS_NOT_AUTHORIZED, 400),
        );
      }

      const passwordIsMatch = await this.encryptionService.isMatch(
        userFinder.value.password,
        param.password,
      );

      if (!passwordIsMatch) {
        return left(
          new ServiceException(ErrorMessages.INVALID_CREDENTIALS, 400),
        );
      }
      const acessToken = await this.jsonWebTokenService.sign({
        sub: userFinder.value.id,
        type: 'access',
      });
      const refreshToken = await this.jsonWebTokenService.sign({
        sub: userFinder.value.id,
        type: 'refresh',
      });

      return right(
        new LoginResponse(
          new AuthTokenEntity({
            accessToken: acessToken,
            refreshToken: refreshToken,
          }),
        ),
      );
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error));
    }
  }
}
