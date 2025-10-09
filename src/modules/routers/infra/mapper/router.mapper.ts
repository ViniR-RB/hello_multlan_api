import { BaseMapper } from '@/core/models/base.mapper';
import BoxModel from '@/modules/box/infra/models/box.model';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import RouterModel from '@/modules/routers/infra/models/route.model';

export default abstract class RouterMapper extends BaseMapper<
  RouterEntity,
  RouterModel
> {
  static toEntity(model: RouterModel): RouterEntity {
    return RouterEntity.fromData({
      id: model.id,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      boxs: model.boxsIds,
    });
  }
  static toModel(entity: RouterEntity): Partial<RouterModel> {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      boxs: entity.boxs?.map(boxId => {
        return {
          id: boxId,
        } as BoxModel;
      }),
      boxsIds: entity.boxs,
    };
  }
}
