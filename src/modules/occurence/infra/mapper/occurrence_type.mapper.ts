import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';
import OccurrenceTypeModel from '@/modules/occurence/infra/models/occurrence_type.model';

export default abstract class OccurrenceTypeMapper {
  static toEntity(model: OccurrenceTypeModel): OccurrenceTypeEntity {
    return OccurrenceTypeEntity.fromData({
      id: model.id,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: OccurrenceTypeEntity): Partial<OccurrenceTypeModel> {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
