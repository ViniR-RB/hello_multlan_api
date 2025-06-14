import { left, right } from '@/core/either/either';
import RouteDomainException from '@/core/erros/route.domain.exception';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import IRemoveBoxRouteUseCase, {
  RemoveBoxRouteParam,
  RemoveBoxRouteResponse,
} from '@/modules/box/domain/usecases/i_remove_box_route_use_case';

export default class RemoveBoxRouteService implements IRemoveBoxRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}
  async execute(
    param: RemoveBoxRouteParam,
  ): AsyncResult<ServiceException, RemoveBoxRouteResponse> {
    try {
      const routeFinder = await this.routeRepository.findById({
        relations: ['boxes'],
        routeId: param.routeId,
        select: ['id', 'boxes', 'createdAt', 'updatedAt'],
      });

      if (routeFinder.isLeft()) {
        return left(new ServiceException(routeFinder.value.message, 404));
      }

      routeFinder.value.removeBox(param.boxId);

      const routeSavedResult = await this.routeRepository.removeBoxByid(
        routeFinder.value,
      );

      if (routeSavedResult.isLeft()) {
        return left(new ServiceException(routeSavedResult.value.message, 500));
      }

      return right(new RemoveBoxRouteResponse());
    } catch (error) {
      if (error instanceof RouteDomainException) {
        return left(new ServiceException(error.message, 500));
      }
    }
  }
}
