import { BaseMapper } from '@/core/models/base.mapper';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import UserMapper from '@/modules/users/infra/mapper/user.mapper';
import UserModel from '@/modules/users/infra/models/user.model';

export default abstract class OccurenceMapper extends BaseMapper<
  OccurrenceEntity,
  OccurrenceModel
> {
  static toEntity(model: OccurrenceModel): OccurrenceEntity {
    return OccurrenceEntity.fromData({
      id: model.id,
      title: model.title,
      description: model.description,
      users: model.users.map(UserMapper.toEntity),
      occurrenceTypeId: model.occurrenceTypeId,
      boxId: model.boxId,
      status: model.status,
      canceledReason: model.canceledReason,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
  static toModel(entity: OccurrenceEntity): Partial<OccurrenceModel> {
    return {
      id: entity.id,
      title: entity.name,
      description: entity.description,
      users: entity.users.map(user => ({ id: user.id }) as UserModel),
      occurrenceTypeId: entity.occurrenceTypeId,
      status: entity.status,
      canceledReason: entity.canceledReason,
      boxId: entity.boxId,
    };
  }
}
