import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import IUpdateOccurrenceTypeUseCase, {
  UpdateOccurrenceTypeParam,
  UpdateOccurrenceTypeResponse,
} from '@/modules/occurence/domain/usecases/i_update_occurrence_type_use_case';

export default class UpdateOccurrenceTypeService
  implements IUpdateOccurrenceTypeUseCase
{
  constructor(
    private readonly occurrenceTypeRepository: IOccurrenceTypeRepository,
  ) {}

  async execute(
    param: UpdateOccurrenceTypeParam,
  ): AsyncResult<AppException, UpdateOccurrenceTypeResponse> {
    try {
      const existingType = await this.occurrenceTypeRepository.findById(
        param.id,
      );
      if (existingType.isLeft()) {
        return left(existingType.value);
      }

      const occurrenceType = existingType.value;
      occurrenceType.updateName(param.name);

      const updated = await this.occurrenceTypeRepository.save(occurrenceType);
      if (updated.isLeft()) {
        return left(updated.value);
      }

      return right(new UpdateOccurrenceTypeResponse(updated.value));
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
