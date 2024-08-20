import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { JwtSignPayload } from '@/core/interfaces/jwt.payload';
import JsonWebTokenService from '@/core/services/json_web_token.service';
import { AsyncResult } from '@/core/types/async_result';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import TokenEntity from '../domain/token.entity';
import IRefreshTokenUseCase from '../domain/usecase/I_refresh_tokens_use_case';

export default class RefreshTokensService implements IRefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JsonWebTokenService,
  ) {}
  async call(
    jwtSignPayload: JwtSignPayload,
  ): AsyncResult<ServiceException, TokenEntity> {
    try {
      const resultUserFinder = await this.userRepository.findOneById(
        jwtSignPayload.sub,
      );
      if (resultUserFinder.isLeft()) {
        return left(new ServiceException(resultUserFinder.value.message, 404));
      }
      const promiseJwt = await Promise.all([
        this.jwtService.sign({
          sub: resultUserFinder.value.userId,
          type: 'access',
        }),
        this.jwtService.sign({
          sub: resultUserFinder.value.userId,
          type: 'refresh',
        }),
      ]);
      return right(new TokenEntity(promiseJwt[0], promiseJwt[1]));
    } catch (e) {}
  }
}
