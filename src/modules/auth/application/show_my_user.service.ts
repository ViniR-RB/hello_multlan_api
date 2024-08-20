import { Either, left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import IUserRepository from '@/modules/user/adapters/i_user_repository';
import IShowMyUserUseCase, {
  ShowMyUserParam,
  ShowMyUserResponse,
} from '../domain/usecase/i_show_my_user_use_case';

export default class ShowMyUserService implements IShowMyUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async call(
    showMyUserParam: ShowMyUserParam,
  ): Promise<Either<ServiceException, ShowMyUserResponse>> {
    const { userId } = showMyUserParam;
    const resultUserFinder = await this.userRepository.findOneById(userId);
    if (resultUserFinder.isLeft()) {
      return left(new ServiceException(resultUserFinder.value.message, 404));
    }
    return right(ShowMyUserResponse.fromEntity(resultUserFinder.value));
  }
}
