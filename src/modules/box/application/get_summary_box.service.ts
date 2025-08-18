import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IBoxRepository from '../adapters/i_box_repository';
import IGetSummaryBoxUseCase from '../domain/usecases/i_get_summary_box_use_case';
import SummaryBoxDto from '../infra/mapper/summary_box_read_model.mapper';

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
