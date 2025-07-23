import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import IGetOccurrencesByBoxUseCase from '../domain/usecases/i_get_occurrences_by_box_use_case';

@Injectable()
export default class GetOccurrencesByBoxService
  implements IGetOccurrencesByBoxUseCase
{
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(
    boxId: string,
  ): Promise<Either<ServiceException, OccurrenceEntity[]>> {
    try {
      const result = await this.occurrenceRepository.findByBoxId(boxId);

      if (result.isLeft()) {
        return left(result.value);
      }

      return right(result.value);
    } catch (error) {
      if (error instanceof ServiceException) {
        return left(error);
      }
      console.error(error);
      return left(new ServiceException('Unexpected error', 500));
    }
  }
}
