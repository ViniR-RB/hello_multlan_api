import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersUseCase, {
  GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersParam,
  GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersResponse,
} from '@/modules/box/domain/usecase/i_get_boxes_with_label_and_location_by_lat_long_min_max_and_filters_use_case';

export default class GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersService
  implements IGetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersUseCase
{
  constructor(private readonly boxRepository: IBoxRepository) {}
  async execute(
    param: GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersParam,
  ): AsyncResult<
    AppException,
    GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersResponse
  > {
    const { latMin, latMax, lngMin, lngMax, zone, hasRouteId, routeId } =
      param;

    const boxesFinderResult =
      await this.boxRepository.findBoxesWithLabelAndLocationByLatLongMinMaxAndFilters(
        latMin,
        latMax,
        lngMin,
        lngMax,
        zone,
        hasRouteId,
        routeId,
      );

    if (boxesFinderResult.isLeft()) {
      return left(boxesFinderResult.value);
    }

    return right(
      new GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersResponse(
        boxesFinderResult.value,
      ),
    );
  }
}
