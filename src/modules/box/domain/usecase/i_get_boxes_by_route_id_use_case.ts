import UseCase from '@/core/interface/use_case';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';

export default interface IGetBoxesByRouteIdUseCase
  extends UseCase<GetBoxesByRouteIdParam, GetBoxesByRouteIdResponse> {}

export interface GetBoxesByRouteIdParam {
  routeId: string;
}

export class GetBoxesByRouteIdResponse {
  constructor(public readonly boxes: BoxWithLabelAndLocationReadModel[]) {}

  fromResponse() {
    return this.boxes;
  }
}
