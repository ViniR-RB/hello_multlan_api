import AppException from '@/core/exceptions/app_exception';
import UseCase from '@/core/interface/use_case';
import AsyncResult from '@/core/types/async_result';
import FileUrlEntity from '@/modules/file/domain/entities/file.url.entity';

export interface IUploadFileUseCase
  extends UseCase<UploadFileParam, UploadFileResponse> {
  execute(
    param: UploadFileParam,
  ): AsyncResult<AppException, UploadFileResponse>;
}

export interface UploadFileParam {
  originalName: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
  encoding?: string;
}

export class UploadFileResponse {
  constructor(public readonly fileUrl: FileUrlEntity) {}

  fromResponse() {
    return this.fileUrl.url;
  }
}
