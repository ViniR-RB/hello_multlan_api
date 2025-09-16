import UseCase from '@/core/interface/use_case';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface IAddBoxsToRouteUseCase
  extends UseCase<AddBoxsToRouteParam, AddBoxsToRouteResponse> {}

export interface AddBoxsToRouteParam {
  routeId: string;
  boxIds: string[];
}

export class AddBoxsToRouteResponse {
  constructor(public readonly route: RouterEntity) {}
  fromResponse() {
    return this.route.toObject();
  }
}
