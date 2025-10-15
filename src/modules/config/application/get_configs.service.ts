import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import IGetConfigsUseCase, {
  GetConfigsParam,
  GetConfigsResponse,
} from '@/modules/config/domain/usecases/i_get_configs_use_case';

export default class GetConfigsService implements IGetConfigsUseCase {
  constructor(private readonly configRepository: IConfigRepository) {}

  async execute(
    param: GetConfigsParam,
  ): AsyncResult<AppException, GetConfigsResponse> {
    try {
      const result = await this.configRepository.findAll(param.pageOptions);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new GetConfigsResponse(result.value));
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
