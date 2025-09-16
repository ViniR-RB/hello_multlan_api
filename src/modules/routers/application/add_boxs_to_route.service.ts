import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IAddBoxsToRouteUseCase, {
  AddBoxsToRouteParam,
  AddBoxsToRouteResponse,
} from '@/modules/routers/domain/usecase/i_add_boxs_to_route_use_case';

export default class AddBoxsToRouteService implements IAddBoxsToRouteUseCase {
  constructor(
    private readonly routeRepository: IRouterRepository,
    private readonly boxRepository: IBoxRepository,
  ) {}
  async execute(
    param: AddBoxsToRouteParam,
  ): AsyncResult<AppException, AddBoxsToRouteResponse> {
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
        route.addBox(box);
      });

      const routerSaved = await this.routeRepository.save(route);

      if (routerSaved.isLeft()) {
        return left(routerSaved.value);
      }

      return right(new AddBoxsToRouteResponse(route));
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
