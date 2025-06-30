import RouteEntity from '@/modules/box/domain/route.entity';
import { BoxMapper } from '@/modules/box/infra/mapper/box_mapper';
import RouteModel from '@/modules/box/infra/model/route.model';

export class RouteMapper {
  static toEntity(routeModel: RouteModel): RouteEntity {
    const { boxes, id, createdAt, updatedAt, name } = routeModel;
    return new RouteEntity(
      {
        boxes: boxes.map(box => BoxMapper.toEntity(box)),
        name,
        createdAt,
        updatedAt,
      },
      id,
    );
  }

  static toModel(routeEntity: RouteEntity) {
    return {
      id: routeEntity.routeId,
      name: routeEntity.routeName,
      boxes: routeEntity.boxes.map(box => BoxMapper.toModel(box)),
      createdAt: routeEntity.createdAt,
      updatedAt: routeEntity.updatedAt,
    };
  }
}
