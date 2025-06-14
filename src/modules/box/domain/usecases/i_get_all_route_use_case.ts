import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import RouteEntity from '@/modules/box/domain/route.entity';

export default interface IGetAllRoutedUseCase {
  execute(): AsyncResult<ServiceException, GetRoutesUseCaseResponse>;
}

export class GetRoutesUseCaseResponse {
  static fromEntity(route: RouteEntity) {
    return route.toObject();
  }
}
