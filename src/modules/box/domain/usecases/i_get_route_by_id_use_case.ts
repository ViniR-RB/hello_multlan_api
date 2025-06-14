import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import RouteEntity from '@/modules/box/domain/route.entity';

export default interface IGetRouteByIdUseCase {
  execute(
    param: GetRouteByIdUseCaseParam,
  ): AsyncResult<ServiceException, GetRouteByIdUseCaseResponse>;
}

export class GetRouteByIdUseCaseParam {
  constructor(public readonly id: string) {
    this.id;
  }
}

export class GetRouteByIdUseCaseResponse {
  static fromEntity(route: RouteEntity) {
    return route.toObject();
  }
}
