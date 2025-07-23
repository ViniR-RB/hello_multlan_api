import { Injectable } from '@nestjs/common';
import { left, right } from 'src/core/either/either';
import OccurrenceDomainException from 'src/core/erros/occurrence.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import ICloseOccurrenceUseCase, { CloseOccurrenceParams } from '../domain/usecases/i_close_occurrence_use_case';
import { AsyncResult } from '@/core/types/async_result';

@Injectable()
export default class CloseOccurrenceService implements ICloseOccurrenceUseCase {
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(param: CloseOccurrenceParams): AsyncResult<ServiceException, OccurrenceEntity> {
    try {
      const findResult = await this.occurrenceRepository.findById(param.occurrenceId);

      if (findResult.isLeft()) {
        return left(findResult.value);
      }

      if (!findResult.value) {
        return left(new ServiceException('Occurrence not found', 404));
      }

      const occurrence = findResult.value;
      occurrence.closeOccurrence(param.userClosingId);

      const updateResult = await this.occurrenceRepository.update(
        param.occurrenceId,
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
