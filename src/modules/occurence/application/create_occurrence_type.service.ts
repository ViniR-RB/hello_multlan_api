import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';
import ICreateOccurrenceTypeUseCase, {
  CreateOccurrenceTypeParam,
  CreateOccurrenceTypeResponse,
} from '@/modules/occurence/domain/usecases/i_create_occurrence_type_use_case';

export default class CreateOccurrenceTypeService
  implements ICreateOccurrenceTypeUseCase
{
  constructor(
    private readonly occurrenceTypeRepository: IOccurrenceTypeRepository,
  ) {}

  async execute(
    param: CreateOccurrenceTypeParam,
  ): AsyncResult<AppException, CreateOccurrenceTypeResponse> {
    try {
      const occurrenceFinder = await this.occurrenceTypeRepository.findOne({
        name: param.name,
      });

      if (occurrenceFinder.isLeft()) {
        return left(occurrenceFinder.value);
      }
      if (occurrenceFinder.isRight()) {
        return left(
          new ServiceException('Occurrence type already existies', 404),
        );
      }

      const occurrenceType = OccurrenceTypeEntity.create({
        name: param.name,
      });

      const saved = await this.occurrenceTypeRepository.save(occurrenceType);
      if (saved.isLeft()) {
        return left(saved.value);
      }

      return right(new CreateOccurrenceTypeResponse(saved.value));
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
