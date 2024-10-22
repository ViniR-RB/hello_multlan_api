import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IGetSummaryBoxUseCase from '../domain/usecases/i_get_summary_box_use_case';
import IBoxRepository from '../adapters/i_box_repository';
import SummaryBoxDto from '../dtos/summary.dto';
import { left, right } from '@/core/either/either';

export default class GetSummaryBoxService implements IGetSummaryBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
  async call(): AsyncResult<ServiceException, SummaryBoxDto> {
    const result = await this.boxRepository.summaryBox();

    if (result.isLeft()) {
      return left(new ServiceException(result.value.message, 400));
    }

    return right(result.value);
  }
}
