import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxesWithLabelAndLocationUseCase, {
  GetBoxesWithLabelAndLocationResponse,
} from '@/modules/box/domain/usecase/i_get_boxes_with_label_and_location_use_case';

export default class GetBoxesWithLabelAndLocationService
  implements IGetBoxesWithLabelAndLocationUseCase
{
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(
    param: void,
  ): AsyncResult<AppException, GetBoxesWithLabelAndLocationResponse> {
    const result = await this.boxRepository.findBoxesWithLabelAndLocation();
    if (result.isLeft()) {
      return left(result.value);
    }
    return right(new GetBoxesWithLabelAndLocationResponse(result.value));
  }
}
