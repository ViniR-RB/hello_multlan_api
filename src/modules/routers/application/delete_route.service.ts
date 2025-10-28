import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IDeleteRouteUseCase, {
  DeleteRouteParam,
  DeleteRouteResponse,
} from '@/modules/routers/domain/usecase/i_delete_route_use_case';

export default class DeleteRouteService implements IDeleteRouteUseCase {
  constructor(private readonly routeRepository: IRouterRepository) {}

  async execute(
    param: DeleteRouteParam,
  ): AsyncResult<AppException, DeleteRouteResponse> {
    const deleteResult = await this.routeRepository.deleteById(param.routeId);

    if (deleteResult.isLeft()) {
      return left(deleteResult.value);
    }

    return right(new DeleteRouteResponse());
  }
}
