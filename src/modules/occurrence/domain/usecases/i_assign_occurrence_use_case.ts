import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import OccurrenceEntity from '@/modules/occurrence/domain/occurrence.entity';

export default interface IAssignOccurrenceUseCase {
  call(
    params: AssignOccurrenceParams,
  ): AsyncResult<ServiceException, OccurrenceEntity>;
}

export class AssignOccurrenceParams {
  id: string;
  userId: string;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
  }
}
