import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxesWithoutRouteUseCase, {
  GetBoxesWithoutRouteResponse,
} from '@/modules/box/domain/usecase/i_get_boxes_without_route_use_case';

export default class GetBoxesWithoutRouteService
  implements IGetBoxesWithoutRouteUseCase
{
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(): AsyncResult<AppException, GetBoxesWithoutRouteResponse> {
    const boxesResult = await this.boxRepository.findBoxesWithoutRouteId();

    if (boxesResult.isLeft()) {
      return left(boxesResult.value);
    }

    return right(new GetBoxesWithoutRouteResponse(boxesResult.value));
  }
}
