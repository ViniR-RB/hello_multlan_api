import OccurrenceEntity from '../../domain/occurrence.entity';
import OccurrenceModel from '../model/occurrence.model';

export default class OccurrenceMapper {
  static toEntity(model: OccurrenceModel): OccurrenceEntity {
    return new OccurrenceEntity(
      {
        title: model.title,
        description: model.description,
        status: model.status,
        boxId: model.boxId,
        createdByUserId: model.createdByUserId,
        receivedByUserId: model.receivedByUserId,
        note: model.note,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      model.id,
    );
  }

  static toModel(entity: OccurrenceEntity): OccurrenceModel {
    const model = new OccurrenceModel();
    const data = entity.toObject();

    model.id = data.id;
    model.title = data.title;
    model.description = data.description;
    model.status = data.status;
    model.boxId = data.boxId;
    model.createdByUserId = data.createdByUserId;
    model.receivedByUserId = data.receivedByUserId;
    model.note = data.note;
    model.createdAt = data.createdAt;
    model.updatedAt = data.updatedAt;

    return model;
  }
}
