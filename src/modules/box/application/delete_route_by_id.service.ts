import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import IDeleteRouteByIdUseCase, {
  DeleteRouteByIdUseCaseParam,
  DeleteRouteByIdUseCaseResponse,
} from '@/modules/box/domain/usecases/i_delete_route_by_id_use_case';

export default class DeleteByIdRouteService implements IDeleteRouteByIdUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(
    param: DeleteRouteByIdUseCaseParam,
  ): AsyncResult<ServiceException, DeleteRouteByIdUseCaseResponse> {
    const routeDeleted = await this.routeRepository.deleteRouteById(param.id);

    if (routeDeleted.isLeft()) {
      return left(new ServiceException(routeDeleted.value.message, 400));
    }
    return right(new DeleteRouteByIdUseCaseResponse());
  }
}
