import UseCase from '@/core/interface/use_case';
import BoxEntity from '@/modules/box/domain/entities/box.entity';

export default interface IGetBoxByIdUseCase
  extends UseCase<GetBoxByIdParam, GetBoxByIdResponse> {}

export interface GetBoxByIdParam {
  boxId: string;
}

export class GetBoxByIdResponse {
  constructor(public readonly box: BoxEntity) {}

  fromResponse() {
    return this.box.toObject();
  }
}
