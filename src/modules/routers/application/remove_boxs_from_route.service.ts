import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IRemoveBoxsFromRouteUseCase, {
  RemoveBoxsFromRouteParam,
  RemoveBoxsFromRouteResponse,
} from '@/modules/routers/domain/usecase/i_remove_boxs_from_route_use_case';

export default class RemoveBoxsFromRouteService
  implements IRemoveBoxsFromRouteUseCase
{
  constructor(
    private readonly routeRepository: IRouterRepository,
    private readonly boxRepository: IBoxRepository,
  ) {}
  async execute(
    param: RemoveBoxsFromRouteParam,
  ): AsyncResult<AppException, RemoveBoxsFromRouteResponse> {
    const routerFinder = await this.routeRepository.findOne({
      routerId: param.routeId,
      relations: ['boxs'],
    });
    if (routerFinder.isLeft()) {
      return left(routerFinder.value);
    }
    const route = routerFinder.value;

    const boxsFinder = await this.boxRepository.findBoxesByIds(param.boxIds);
    if (boxsFinder.isLeft()) {
      return left(boxsFinder.value);
    }

    const boxs = boxsFinder.value;
    try {
      boxs.map(box => {
        route.removeBox(box);
      });

      const routerSaved = await this.routeRepository.save(route);

      if (routerSaved.isLeft()) {
        return left(routerSaved.value);
      }

      // Salvar as caixas com routerId = null
      for (const box of boxs) {
        const boxSaved = await this.boxRepository.save(box);
        if (boxSaved.isLeft()) {
          return left(boxSaved.value);
        }
      }

      return right(new RemoveBoxsFromRouteResponse(route));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
