import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import ICreateRouteUseCase, {
  CreateRouteParam,
  CreateRouteResponse,
} from '@/modules/routers/domain/usecase/i_create_route_use_case';

export default class CreateRouteService implements ICreateRouteUseCase {
  constructor(
    private readonly boxRepository: IBoxRepository,
    private readonly routeRepository: IRouterRepository,
  ) {}
  async execute(
    param: CreateRouteParam,
  ): AsyncResult<AppException, CreateRouteResponse> {
    try {
      const boxesResult = await this.boxRepository.findBoxesByIds(param.boxs);
      if (boxesResult.isLeft()) {
        return left(boxesResult.value);
      }
      const boxes = boxesResult.value;

      if (boxes.length !== param.boxs.length) {
        return left(
          new ServiceException(
            ` ${boxes.filter(box => !param.boxs.includes(box.id)).map(box => box.id)} boxes not found`,
            404,
          ),
        );
      }
      const routeEntity = new RouterEntity({
        name: param.name,
        boxs: boxes,
      });
      boxes.map(box => box.addRoute(routeEntity.id));

      const rounteSavedResult = await this.routeRepository.save(routeEntity);
      if (rounteSavedResult.isLeft()) {
        return left(rounteSavedResult.value);
      }
      return right(new CreateRouteResponse(rounteSavedResult.value));
    } catch (e) {
      if (e instanceof AppException) {
        return left(e);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, e));
    }
  }
}
