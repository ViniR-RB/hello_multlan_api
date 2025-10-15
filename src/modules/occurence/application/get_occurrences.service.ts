import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import IGetOccurrencesUseCase, {
  GetOccurrencesParam,
  GetOccurrencesResponse,
} from '@/modules/occurence/domain/usecases/i_get_occurrences_use_case';

export default class GetOccurrencesService implements IGetOccurrencesUseCase {
  constructor(private readonly occurrenceRepository: IOcurrenceRepository) {}
  async execute(
    param: GetOccurrencesParam,
  ): AsyncResult<AppException, GetOccurrencesResponse> {
    const occurrences = await this.occurrenceRepository.findMany(
      param.pageOptions,
      param.status,
      param.boxId,
      param.userId,
      param.occurrenceTypeId,
    );
    if (occurrences.isLeft()) {
      return left(occurrences.value);
    }
    return right(new GetOccurrencesResponse(occurrences.value));
  }
}
