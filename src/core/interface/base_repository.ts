import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';

export default interface BaseRepository<M, E> {
  create(entity: E): M;
  save(entity: E): AsyncResult<AppException, E>;
}
