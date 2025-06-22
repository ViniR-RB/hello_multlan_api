import Nil from '@/core/either/nil';
import { AsyncResult } from '@/core/types/async_result';
import { left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import { EncryptionService } from 'src/core/services/encryption.service';
import JsonWebTokenService from 'src/core/services/json_web_token.service';
import TokenEntity from 'src/modules/auth/domain/token.entity';
import ILoginUseCase from 'src/modules/auth/domain/usecase/i_login_use_case';
import IUserRepository from '../../user/adapters/i_user_repository';
import { LoginParams } from '../domain/usecase/i_login_use_case';

export default class LoginUserService implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JsonWebTokenService,
  ) {}
  async call(
    loginParams: LoginParams,
  ): AsyncResult<ServiceException, TokenEntity> {
    const { email } = loginParams;
    const resultUserFinder = await this.userRepository.findOneByEmail(email);

    if (resultUserFinder.isLeft()) {
      return left(new ServiceException(resultUserFinder.value.message, 404));
    }

    if (resultUserFinder.value instanceof Nil) {
      return left(new ServiceException('User not found', 404));
    }

    const comparePassword = await this.encryptionService.isMatch(
      resultUserFinder.value.userPassword,
      loginParams.password,
    );
    if (!comparePassword) {
      return left(new ServiceException('E-mail or Password is not match', 401));
    }

    const promiseJwt = await Promise.all([
      this.jwtService.sign({
        sub: resultUserFinder.value.userId,
        role: resultUserFinder.value.userRole,
        type: 'access',
      }),
      this.jwtService.sign({
        sub: resultUserFinder.value.userId,
        role: resultUserFinder.value.userRole,
        type: 'refresh',
      }),
    ]);
    return right(new TokenEntity(promiseJwt[0], promiseJwt[1]));
  }
}
