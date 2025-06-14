import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default interface IDeleteRouteByIdUseCase {
  execute(
    param: DeleteRouteByIdUseCaseParam,
  ): AsyncResult<ServiceException, DeleteRouteByIdUseCaseResponse>;
}

export class DeleteRouteByIdUseCaseParam {
  constructor(public readonly id: string) {}
}

export class DeleteRouteByIdUseCaseResponse {}
