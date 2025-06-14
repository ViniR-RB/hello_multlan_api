import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default interface IRemoveBoxRouteUseCase {
  execute(
    param: RemoveBoxRouteParam,
  ): AsyncResult<ServiceException, RemoveBoxRouteResponse>;
}

export class RemoveBoxRouteParam {
  constructor(
    public readonly boxId: string,
    public readonly routeId: string,
  ) {
    this.boxId;
    this.routeId;
  }
}

export class RemoveBoxRouteResponse {}
