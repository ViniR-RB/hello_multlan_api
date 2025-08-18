import IUserRepository from '@/modules/user/adapters/i_user_repository';
import IExtractUserFromJwt, {
  ExtractUserFromJwtParam,
  ExtractUserFromJwtResponse,
} from '../domain/usecase/i_extract_user_fow_jwt';
import { left, right } from '@/core/either/either';
import AppException from '@/core/erros/app.exception';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default class ExtractUserFromJwtService implements IExtractUserFromJwt {
  constructor(private readonly userRepository: IUserRepository) {}

  async call(
    param: ExtractUserFromJwtParam,
  ): AsyncResult<AppException, ExtractUserFromJwtResponse> {
    const user = await this.userRepository.findOneById(param.payload.sub);
    if (user.isLeft()) {
      return left(new ServiceException('User not found', 404));
    }
    return right(ExtractUserFromJwtResponse.fromEntity(user.value));
  }
}
