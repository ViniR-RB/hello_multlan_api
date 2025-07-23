import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import IGetOccurrenceByIdUseCase from '../domain/usecases/i_get_occurrence_by_id_use_case';

@Injectable()
export default class GetOccurrenceByIdService
  implements IGetOccurrenceByIdUseCase
{
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(id: string): Promise<Either<ServiceException, OccurrenceEntity>> {
    try {
      const result = await this.occurrenceRepository.findById(id);

      if (result.isLeft()) {
        return left(result.value);
      }

      if (!result.value) {
        return left(new ServiceException('Occurrence not found', 404));
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
