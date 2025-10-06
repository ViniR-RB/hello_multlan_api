import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxSummaryUseCase, {
  GetBoxSummaryResponse,
} from '@/modules/box/domain/usecase/i_get_box_summary_use_case';

export default class GetBoxSummaryService implements IGetBoxSummaryUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(param: void): AsyncResult<AppException, GetBoxSummaryResponse> {
    const boxSummaryResult = await this.boxRepository.getSummary();
    if (boxSummaryResult.isLeft()) {
      return left(boxSummaryResult.value);
    }
    return right(new GetBoxSummaryResponse(boxSummaryResult.value));
  }
}
