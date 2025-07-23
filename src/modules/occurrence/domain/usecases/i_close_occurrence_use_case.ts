import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import OccurrenceEntity from '@/modules/occurrence/domain/occurrence.entity';

export default interface ICloseOccurrenceUseCase {
  call(param: CloseOccurrenceParams): AsyncResult<ServiceException, OccurrenceEntity>;
}

export class CloseOccurrenceParams {
  constructor(
    public readonly occurrenceId: string,
    public readonly userClosingId: string,
  ) {}
}
