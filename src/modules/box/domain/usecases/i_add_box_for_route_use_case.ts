import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default interface IAddBoxForRouteUseCase {
  execute(param: AddBoxForParam): AsyncResult<ServiceException, AddBoxResponse>;
}

export class AddBoxForParam {
  constructor(
    public readonly routeId: string,
    public readonly boxId: string,
  ) {}
}

export class AddBoxResponse {}
