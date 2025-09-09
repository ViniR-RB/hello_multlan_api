import UseCase from '@/core/interface/use_case';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface ICreateRouteUseCase
  extends UseCase<CreateRouteParam, CreateRouteResponse> {}

export interface CreateRouteParam {
  name: string;
  boxs: string[];
}

export class CreateRouteResponse {
  constructor(public readonly routeEntity: RouterEntity) {}

  fromResponse() {
    return this.routeEntity.toObject();
  }
}
