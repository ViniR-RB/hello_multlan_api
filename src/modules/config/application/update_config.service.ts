import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import IUpdateConfigUseCase, {
  UpdateConfigParam,
  UpdateConfigResponse,
} from '@/modules/config/domain/usecases/i_update_config_use_case';

export default class UpdateConfigService implements IUpdateConfigUseCase {
  constructor(private readonly configRepository: IConfigRepository) {}

  async execute(
    param: UpdateConfigParam,
  ): AsyncResult<AppException, UpdateConfigResponse> {
    try {
      const existingConfig = await this.configRepository.findById(param.id);
      if (existingConfig.isLeft()) {
        return left(existingConfig.value);
      }

      const config = existingConfig.value;
      config.updateValue(param.value);

      const updated = await this.configRepository.save(config);
      if (updated.isLeft()) {
        return left(updated.value);
      }

      return right(new UpdateConfigResponse(updated.value));
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
