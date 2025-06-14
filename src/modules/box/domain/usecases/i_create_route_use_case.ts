import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import BoxEntity from '@/modules/box/domain/box.entity';
import RouteEntity from '@/modules/box/domain/route.entity';

export default interface ICreateRouteUseCase {
  execute(
    param: CreateRouteParam,
  ): AsyncResult<ServiceException, CreateRouteParamResponse>;
}
export class CreateRouteParam {
  constructor(public readonly boxes: Array<string>) {}

  toEntity(): RouteEntity {
    return new RouteEntity({
      boxes: this.boxes.map(box => new BoxEntity({} as any, box)),
    });
  }
}

export class CreateRouteParamResponse {
  id: string;
  boxes: Array<string>;

  constructor(id: string, boxes: Array<string>) {
    this.id = id;
    this.boxes = boxes;
  }

  static fromEntity(routeEntity: RouteEntity): CreateRouteParamResponse {
    return new CreateRouteParamResponse(
      routeEntity.routeId,
      routeEntity.boxes.map(box => box.boxId),
    );
  }
}
