import UseCase from '@/core/interface/use_case';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';

export default interface IGetBoxesWithLabelAndLocationUseCase
  extends UseCase<void, GetBoxesWithLabelAndLocationResponse> {}

export class GetBoxesWithLabelAndLocationResponse {
  constructor(public boxes: BoxWithLabelAndLocationReadModel[]) {}

  fromResponse() {
    return this.boxes;
  }
}
