import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import IGetOccurrenceTypeByIdUseCase, {
  GetOccurrenceTypeByIdParam,
  GetOccurrenceTypeByIdResponse,
} from '@/modules/occurence/domain/usecases/i_get_occurrence_type_by_id_use_case';

export default class GetOccurrenceTypeByIdService
  implements IGetOccurrenceTypeByIdUseCase
{
  constructor(
    private readonly occurrenceTypeRepository: IOccurrenceTypeRepository,
  ) {}

  async execute(
    param: GetOccurrenceTypeByIdParam,
  ): AsyncResult<AppException, GetOccurrenceTypeByIdResponse> {
    try {
      const result = await this.occurrenceTypeRepository.findById(param.id);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new GetOccurrenceTypeByIdResponse(result.value));
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
