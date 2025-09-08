import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { Unit, unit } from '@/core/types/unit';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import {
  DeleteFileParam,
  IDeleteFileUseCase,
} from '@/modules/file/domain/usecase/i_delete_file_use_case';

export default class DeleteFileService implements IDeleteFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}
  async execute(param: DeleteFileParam): AsyncResult<AppException, Unit> {
    const result = await this.fileRepository.delete(param.fileName);

    if (result.isLeft()) {
      return left(result.value);
    }
    return right(unit);
  }
}
