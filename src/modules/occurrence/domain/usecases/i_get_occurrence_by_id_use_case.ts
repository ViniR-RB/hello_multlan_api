import { AsyncResult } from '@/core/types/async_result';
import ServiceException from 'src/core/erros/service.exception';
import OccurrenceEntity from '../occurrence.entity';

export default interface IGetOccurrenceByIdUseCase {
  call(id: string): AsyncResult<ServiceException, OccurrenceEntity>;
}
