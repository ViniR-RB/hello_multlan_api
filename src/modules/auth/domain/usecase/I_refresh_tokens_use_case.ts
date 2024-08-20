import ServiceException from '@/core/erros/service.exception';
import { JwtSignPayload } from '@/core/interfaces/jwt.payload';
import { AsyncResult } from '@/core/types/async_result';
import TokenEntity from '../token.entity';

export default interface IRefreshTokenUseCase {
  call(
    jwtSignPayload: JwtSignPayload,
  ): AsyncResult<ServiceException, TokenEntity>;
}
