import { BaseMapper } from '@/core/models/base.mapper';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import BoxModel from '@/modules/box/infra/models/box.model';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';

export default abstract class BoxMapper extends BaseMapper<
  BoxEntity,
  BoxModel
> {
  static toEntity(model: BoxModel): BoxEntity {
    return BoxEntity.fromData({
      id: model.id,
      label: model.label,
      latitude: model.latitude,
      longitude: model.longitude,
      freeSpace: model.freeSpace,
      filledSpace: model.filledSpace,
      signal: model.signal,
      zone: model.zone,
      routeId: model.routeId,
      imageUrl: model.imageUrl,
      note: model.note,
      listUser: model.listUser,
      createdByUserId: model.createdByUserId,
      createdAt: model.createdAt,
      updatedByUserId: model.updatedByUserId,
      updatedAt: model.updatedAt,
    });
  }
  static toModel(entity: BoxEntity): Partial<BoxModel> {
    return {
      id: entity.id,
      label: entity.label,
      latitude: entity.latitude,
      longitude: entity.longitude,
      freeSpace: entity.freeSpace,
      filledSpace: entity.filledSpace,
      signal: entity.signal,
      routeId: entity.routeId,
      zone: entity.zone,
      imageUrl: entity.imageUrl || null,
      listUser: entity.listUser,
      note: entity.note || null,
      createdByUserId: entity.createdByUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      updatedByUserId: entity.updatedByUserId,
    };
  }

  static toBoxWithLabelAndLocationReadModel(
    model: Partial<BoxModel>,
  ): BoxWithLabelAndLocationReadModel {
    return {
      id: model.id!,
      label: model.label!,
      latitude: model.latitude!,
      longitude: model.longitude!,
    };
  }
}
