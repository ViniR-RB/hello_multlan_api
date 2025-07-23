import { AsyncResult } from '@/core/types/async_result';
import ServiceException from 'src/core/erros/service.exception';
import OccurrenceEntity from '../occurrence.entity';

export default interface IUpdateOccurrenceUseCase {
  call(
    params: UpdateOccurrenceParams,
  ): AsyncResult<ServiceException, OccurrenceEntity>;
}

export class UpdateOccurrenceParams {
  id: string;
  title?: string;
  description?: string;
  note?: string;

  constructor(id: string, title?: string, description?: string, note?: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.note = note;
  }
}
