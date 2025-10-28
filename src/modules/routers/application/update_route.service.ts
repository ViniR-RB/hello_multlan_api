import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IUpdateRouteUseCase, {
  UpdateRouteParam,
  UpdateRouteResponse,
} from '@/modules/routers/domain/usecase/i_update_route_use_case';

export default class UpdateRouteService implements IUpdateRouteUseCase {
  constructor(private readonly routeRepository: IRouterRepository) {}

  async execute(
    param: UpdateRouteParam,
  ): AsyncResult<AppException, UpdateRouteResponse> {
    const routeResult = await this.routeRepository.findOne({
      routerId: param.routeId,
    });

    if (routeResult.isLeft()) {
      return left(routeResult.value);
    }

    const route = routeResult.value;

    try {
      route.updateData(param.name);
    } catch (error) {
      return left(
        new ServiceException(
          error instanceof Error
            ? error.message
            : ErrorMessages.UNEXPECTED_ERROR,
          400,
          error,
        ),
      );
    }

    const savedRouteResult = await this.routeRepository.save(route);

    if (savedRouteResult.isLeft()) {
      return left(savedRouteResult.value);
    }

    return right(new UpdateRouteResponse(savedRouteResult.value));
  }
}
