import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import OccurrenceDomainException from 'src/core/erros/occurrence.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import IUpdateOccurrenceUseCase, {
  UpdateOccurrenceParams,
} from '../domain/usecases/i_update_occurrence_use_case';

@Injectable()
export default class UpdateOccurrenceService
  implements IUpdateOccurrenceUseCase
{
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(
    params: UpdateOccurrenceParams,
  ): Promise<Either<ServiceException, OccurrenceEntity>> {
    try {
      const findResult = await this.occurrenceRepository.findById(params.id);

      if (findResult.isLeft()) {
        return left(findResult.value);
      }

      if (!findResult.value) {
        return left(new ServiceException('Occurrence not found', 404));
      }

      const occurrence = findResult.value;
      occurrence.updateOccurrence({
        title: params.title,
        description: params.description,
        note: params.note,
      });

      const updateResult = await this.occurrenceRepository.update(
        params.id,
        occurrence,
      );

      if (updateResult.isLeft()) {
        return left(updateResult.value);
      }

      return right(updateResult.value);
    } catch (error) {
      if (error instanceof OccurrenceDomainException) {
        return left(new ServiceException(error.message, 400));
      }
      if (error instanceof ServiceException) {
        return left(error);
      }
      console.error(error);
      return left(new ServiceException('Unexpected error', 500));
    }
  }
}
