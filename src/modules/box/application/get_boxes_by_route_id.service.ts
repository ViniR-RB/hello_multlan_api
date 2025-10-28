import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxesByRouteIdUseCase, {
  GetBoxesByRouteIdParam,
  GetBoxesByRouteIdResponse,
} from '@/modules/box/domain/usecase/i_get_boxes_by_route_id_use_case';

export default class GetBoxesByRouteIdService
  implements IGetBoxesByRouteIdUseCase
{
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(
    param: GetBoxesByRouteIdParam,
  ): AsyncResult<AppException, GetBoxesByRouteIdResponse> {
    const boxesResult = await this.boxRepository.findBoxesByRouteId(
      param.routeId,
    );

    if (boxesResult.isLeft()) {
      return left(boxesResult.value);
    }

    return right(new GetBoxesByRouteIdResponse(boxesResult.value));
  }
}
