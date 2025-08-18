import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IBoxRepository from '../adapters/i_box_repository';
import IGetSummaryBoxUseCase, {
  GetSummaryBoxResponse,
} from '../domain/usecases/i_get_summary_box_use_case';

export default class GetSummaryBoxService implements IGetSummaryBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
  async call(_: void): AsyncResult<ServiceException, GetSummaryBoxResponse> {
    const result = await this.boxRepository.summaryBox();

    if (result.isLeft()) {
      return left(new ServiceException(result.value.message, 400));
    }

    return right(new GetSummaryBoxResponse(result.value));
  }
}
