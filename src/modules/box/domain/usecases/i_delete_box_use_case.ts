import Nil from '@/core/either/nil';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';

export default interface IDeleteBoxUseCase {
  call(id: string): AsyncResult<ServiceException, Nil>;
}
