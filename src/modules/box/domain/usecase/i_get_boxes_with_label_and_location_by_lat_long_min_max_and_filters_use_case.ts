import UseCase from '@/core/interface/use_case';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';

export default interface IGetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersUseCase
  extends UseCase<
    GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersParam,
    GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersResponse
  > {}

export interface GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersParam {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  zone?: BoxZone;
}

export class GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersResponse {
  constructor(public readonly boxes: BoxWithLabelAndLocationReadModel[]) {}

  fromResponse() {
    return this.boxes;
  }
}
