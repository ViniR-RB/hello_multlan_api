import UseCase from '@/core/interface/use_case';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface IRemoveBoxsFromRouteUseCase
  extends UseCase<RemoveBoxsFromRouteParam, RemoveBoxsFromRouteResponse> {}

export interface RemoveBoxsFromRouteParam {
  routeId: string;
  boxIds: string[];
}

export class RemoveBoxsFromRouteResponse {
  constructor(public readonly route: RouterEntity) {}
  fromResponse() {
    return this.route.toObject();
  }
}
