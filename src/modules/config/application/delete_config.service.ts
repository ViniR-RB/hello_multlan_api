import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit } from '@/core/types/unit';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import IDeleteConfigUseCase, {
  DeleteConfigParam,
  DeleteConfigResponse,
} from '@/modules/config/domain/usecases/i_delete_config_use_case';

export default class DeleteConfigService implements IDeleteConfigUseCase {
  constructor(private readonly configRepository: IConfigRepository) {}

  async execute(
    param: DeleteConfigParam,
  ): AsyncResult<AppException, DeleteConfigResponse> {
    try {
      const existingConfig = await this.configRepository.findById(param.id);
      if (existingConfig.isLeft()) {
        return left(existingConfig.value);
      }

      const result = await this.configRepository.delete(param.id);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new DeleteConfigResponse(unit));
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
