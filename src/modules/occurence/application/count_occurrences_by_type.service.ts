import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import ICountOccurrencesByTypeUseCase, {
  CountOccurrencesByTypeParam,
  CountOccurrencesByTypeResponse,
} from '@/modules/occurence/domain/usecases/i_count_occurrences_by_type_use_case';

export default class CountOccurrencesByTypeService
  implements ICountOccurrencesByTypeUseCase
{
  constructor(private readonly occurrenceRepository: IOcurrenceRepository) {}

  async execute(
    param: CountOccurrencesByTypeParam,
  ): AsyncResult<AppException, CountOccurrencesByTypeResponse> {
    try {
      const result = await this.occurrenceRepository.countByTypeAndPeriod(
        param.occurrenceTypeId,
        param.startDate,
        param.endDate,
        param.boxId,
      );

      if (result.isLeft()) {
        return left(result.value);
      }

      return right(
        new CountOccurrencesByTypeResponse(result.value, param.boxId),
      );
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
