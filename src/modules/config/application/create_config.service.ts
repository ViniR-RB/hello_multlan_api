import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';
import ICreateConfigUseCase, {
  CreateConfigParam,
  CreateConfigResponse,
} from '@/modules/config/domain/usecases/i_create_config_use_case';

export default class CreateConfigService implements ICreateConfigUseCase {
  constructor(private readonly configRepository: IConfigRepository) {}

  async execute(
    param: CreateConfigParam,
  ): AsyncResult<AppException, CreateConfigResponse> {
    try {
      // Verifica se já existe uma config com essa key
      const existingConfig = await this.configRepository.findByKey(param.key);
      if (existingConfig.isRight()) {
        return left(
          new ServiceException('Config with this key already exists', 409),
        );
      }

      const config = ConfigEntity.create(param.key, param.value);

      const saved = await this.configRepository.save(config);
      if (saved.isLeft()) {
        return left(saved.value);
      }

      return right(new CreateConfigResponse(saved.value));
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
