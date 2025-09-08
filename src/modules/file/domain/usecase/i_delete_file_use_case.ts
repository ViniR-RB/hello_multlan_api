import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';

export interface IDeleteFileUseCase {
  execute(param: DeleteFileParam): AsyncResult<AppException, Unit>;
}

export interface DeleteFileParam {
  fileName: string;
}
