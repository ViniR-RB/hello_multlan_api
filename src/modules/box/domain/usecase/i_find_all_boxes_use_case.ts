import UseCase from '@/core/interface/use_case';
import BoxEntity from '@/modules/box/domain/entities/box.entity';

export default interface IFindAllBoxesUseCase
  extends UseCase<void, FindAllBoxesResponse> {}

export class FindAllBoxesResponse {
  constructor(public readonly boxes: BoxEntity[]) {}

  fromResponse() {
    return this.boxes.map(box => box.toObject());
  }
}
