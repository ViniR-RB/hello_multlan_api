import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import IGetOccurrenceTypesUseCase, {
  GetOccurrenceTypesParam,
  GetOccurrenceTypesResponse,
} from '@/modules/occurence/domain/usecases/i_get_occurrence_types_use_case';

export default class GetOccurrenceTypesService
  implements IGetOccurrenceTypesUseCase
{
  constructor(
    private readonly occurrenceTypeRepository: IOccurrenceTypeRepository,
  ) {}

  async execute(
    param: GetOccurrenceTypesParam,
  ): AsyncResult<AppException, GetOccurrenceTypesResponse> {
    try {
      const result = await this.occurrenceTypeRepository.findAll(
        param.pageOptions,
      );
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new GetOccurrenceTypesResponse(result.value));
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
