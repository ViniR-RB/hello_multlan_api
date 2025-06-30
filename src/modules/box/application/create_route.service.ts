import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import BoxEntity from '@/modules/box/domain/box.entity';
import RouteEntity from '@/modules/box/domain/route.entity';
import ICreateRouteUseCase, {
  CreateRouteParam,
  CreateRouteParamResponse,
} from '@/modules/box/domain/usecases/i_create_route_use_case';

export default class CreateRouteService implements ICreateRouteUseCase {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly boxRepository: IBoxRepository,
  ) {}
  async execute(
    param: CreateRouteParam,
  ): AsyncResult<ServiceException, CreateRouteParamResponse> {
    try {
      const routeEntity = new RouteEntity({
        name: param.name,
        boxes: param.boxes.map(boxId => {
          return new BoxEntity({} as any, boxId);
        }),
      });

      if (param.boxes && param.boxes.length > 0) {
        const boxesResult = await this.boxRepository.findByIds(param.boxes);

        if (boxesResult.isLeft()) {
          return left(new ServiceException(boxesResult.value.message, 404));
        }

        if (boxesResult.value.length !== param.boxes.length) {
          const foundIds = boxesResult.value.map(box => box.boxId);

          const missingIds = param.boxes.filter(id => !foundIds.includes(id));

          return left(
            new ServiceException(
              `Some boxes were not found: ${missingIds.join(', ')} `,
              404,
            ),
          );
        }
        boxesResult.value.forEach(box => {
          routeEntity.addBox(box);
        });
      }

      const routeSavedResult = await this.routeRepository.save(routeEntity);

      if (routeSavedResult.isLeft()) {
        return left(new ServiceException(routeSavedResult.value.message, 400));
      }

      return right(CreateRouteParamResponse.fromEntity(routeSavedResult.value));
    } catch (error) {
      if (error instanceof Error) {
        return left(new ServiceException(error.message, 400));
      }
    }
  }
}
