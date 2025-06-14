import BoxEntity from '@/modules/box/domain/box.entity';
import BoxModel from '@/modules/box/infra/model/box.model';

export class BoxMapper {
  static toEntity(boxModel: BoxModel): BoxEntity {
    const {
      id,
      label,
      latitude,
      longitude,
      freeSpace,
      filledSpace,
      signal,
      image,
      zone,
      note,
      listUser,
      createdAt,
      updatedAt,
      routeId,
    } = boxModel;
    return new BoxEntity(
      {
        label,
        latitude,
        longitude,
        freeSpace,
        filledSpace,
        signal,
        image,
        zone,
        note,
        listUser,
        createdAt,
        updatedAt,
        routeId: routeId,
      },
      id,
    );
  }

  static toModel(boxEntity: BoxEntity) {
    return {
      id: boxEntity.boxId,
      label: boxEntity.label,
      latitude: boxEntity.latitude,
      longitude: boxEntity.longitude,
      freeSpace: boxEntity.freeSpace,
      filledSpace: boxEntity.filledSpace,
      signal: boxEntity.signal,
      image: boxEntity.imageUrl,
      zone: boxEntity.zone,
      note: boxEntity.note,
      listUser: boxEntity.listUser,
      createdAt: boxEntity.createdAt,
      updatedAt: boxEntity.updatedAt,
      route: { id: boxEntity.routeId },
    };
  }
}
