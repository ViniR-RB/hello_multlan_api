import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import OccurrenceEntity, {
  OccurrenceStatus,
} from '@/modules/occurrence/domain/occurrence.entity';

export default interface ICreateOccurrenceUseCase {
  call(
    params: CreateOccurrenceParams,
  ): AsyncResult<ServiceException, OccurrenceEntity>;
}

export class CreateOccurrenceParams {
  title: string;
  description: string;
  boxId: string;
  createdByUserId: string;
  assignedToUserId: string;
  note?: string;

  constructor(
    title: string,
    description: string,
    boxId: string,
    createdByUserId: string,
    assignedToUserId: string,
    note?: string,
  ) {
    this.title = title;
    this.description = description;
    this.boxId = boxId;
    this.createdByUserId = createdByUserId;
    this.assignedToUserId = assignedToUserId;
    this.note = note;
  }

  toEntity(): OccurrenceEntity {
    return new OccurrenceEntity({
      title: this.title,
      description: this.description,
      status: OccurrenceStatus.CREATED,
      boxId: this.boxId,
      createdByUserId: this.createdByUserId,
      receivedByUserId: this.assignedToUserId,
      note: this.note,
    });
  }
}
