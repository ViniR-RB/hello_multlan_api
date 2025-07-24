import AppException from '@/core/erros/app.exception';
import { AsyncResult } from '@/core/types/async_result';

export interface IUseCase<T, R> {
  call(param: T): AsyncResult<AppException, R>;
}
