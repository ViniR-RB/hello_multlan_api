import UseCase from '@/core/interface/use_case';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface IUpdateRouteUseCase
  extends UseCase<UpdateRouteParam, UpdateRouteResponse> {}

export interface UpdateRouteParam {
  routeId: string;
  name: string;
}

export class UpdateRouteResponse {
  constructor(public readonly route: RouterEntity) {}

  fromResponse() {
    return this.route.toObject();
  }
}
