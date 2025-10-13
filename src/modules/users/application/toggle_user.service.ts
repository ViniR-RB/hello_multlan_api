import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IToggleUserUseCase, {
  ToggleUserParam,
  ToggleUserResponse,
} from '@/modules/users/domain/usecase/i_toggle_user_use_case';

export default class ToggleUserService implements IToggleUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    param: ToggleUserParam,
  ): AsyncResult<AppException, ToggleUserResponse> {
    try {
      // Verificar se o usuário solicitante existe e tem permissão
      const requestingUserFinder = await this.userRepository.findOne({
        userId: param.requestingUserId,
      });
      if (requestingUserFinder.isLeft()) {
        return left(requestingUserFinder.value);
      }

      const requestingUser = requestingUserFinder.value;

      // Verificar se o usuário solicitante é admin
      if (!requestingUser.userHasAdmin()) {
        return left(
          new ServiceException(
            'Only administrators can toggle user status',
            403,
          ),
        );
      }

      // Buscar o usuário alvo
      const targetUserFinder = await this.userRepository.findOne({
        userId: param.targetUserId,
      });
      if (targetUserFinder.isLeft()) {
        return left(targetUserFinder.value);
      }

      const targetUser = targetUserFinder.value;

      // Aplicar a regra de negócio através da entidade
      targetUser.toggleUserByAdmin(param.requestingUserId);

      // Salvar o usuário atualizado
      const savedUser = await this.userRepository.save(targetUser);
      if (savedUser.isLeft()) {
        return left(savedUser.value);
      }

      return right(new ToggleUserResponse(savedUser.value));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
