import { BaseMapper } from '@/core/models/base.mapper';
import BoxMapper from '@/modules/box/infra/mapper/box.mapper';
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
      boxs: model.boxs.map(BoxMapper.toEntity),
    });
  }
  static toModel(entity: RouterEntity): Partial<RouterModel> {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      boxs: (entity.boxs ?? []).map(box => BoxMapper.toModel(box) as BoxModel),
    };
  }
}
