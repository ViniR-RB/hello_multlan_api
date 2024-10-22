import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default interface IGetSummaryBoxUseCase {
  call(): AsyncResult<ServiceException, any>;
}
