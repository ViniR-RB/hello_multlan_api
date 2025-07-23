import { Either, left, right } from '@/core/either/either';
import OccurrenceDomainException from '@/core/erros/occurrence.domain.exception';
import ServiceException from '@/core/erros/service.exception';
import IOccurrenceRepository from '@/modules/occurrence/adapters/i_occurrence_repository';
import OccurrenceEntity from '@/modules/occurrence/domain/occurrence.entity';
import ICancelOccurrenceUseCase, {
  CancelOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_cancel_occurrence_use_case';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class CancelOccurrenceService
  implements ICancelOccurrenceUseCase
{
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(
    params: CancelOccurrenceParams,
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
      occurrence.cancelOccurrence(params.userId, params.cancellationReason);

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
