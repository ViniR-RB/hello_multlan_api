import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import {
  IUploadFileUseCase,
  UploadFileParam,
  UploadFileResponse,
} from '@/modules/file/domain/usecase/i_upload_file_use_case';

export default class UploadFileService implements IUploadFileUseCase {
  constructor(private readonly fileRepository: IFileRepository) {}
  async execute(
    param: UploadFileParam,
  ): AsyncResult<AppException, UploadFileResponse> {
    const fileEntity = new FileEntity({
      buffer: param.buffer,
      originalName: param.originalName,
      mimetype: param.mimetype,
      size: param.size,
      encoding: param.encoding,
      filename: param.originalName,
    });

    const result = await this.fileRepository.save(fileEntity);

    if (result.isLeft()) {
      return left(result.value);
    }
    return right(new UploadFileResponse(result.value));
  }
}
