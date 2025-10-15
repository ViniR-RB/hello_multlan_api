import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit } from '@/core/types/unit';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import IDeleteOccurrenceTypeUseCase, {
  DeleteOccurrenceTypeParam,
  DeleteOccurrenceTypeResponse,
} from '@/modules/occurence/domain/usecases/i_delete_occurrence_type_use_case';

export default class DeleteOccurrenceTypeService
  implements IDeleteOccurrenceTypeUseCase
{
  constructor(
    private readonly occurrenceTypeRepository: IOccurrenceTypeRepository,
  ) {}

  async execute(
    param: DeleteOccurrenceTypeParam,
  ): AsyncResult<AppException, DeleteOccurrenceTypeResponse> {
    try {
      const existingType = await this.occurrenceTypeRepository.findById(
        param.id,
      );
      if (existingType.isLeft()) {
        return left(existingType.value);
      }

      const result = await this.occurrenceTypeRepository.delete(param.id);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(new DeleteOccurrenceTypeResponse(unit));
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
