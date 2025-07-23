import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import IGetAllOccurrencesUseCase from '../domain/usecases/i_get_all_occurrences_use_case';

@Injectable()
export default class GetAllOccurrencesService
  implements IGetAllOccurrencesUseCase
{
  constructor(private readonly occurrenceRepository: IOccurrenceRepository) {}

  async call(): Promise<Either<ServiceException, OccurrenceEntity[]>> {
    try {
      const result = await this.occurrenceRepository.findAll();

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
