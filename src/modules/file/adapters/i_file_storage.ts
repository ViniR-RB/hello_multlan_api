import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileUrlEntity from '@/modules/file/domain/entities/file.url.entity';

export default interface IFileStorage {
  store(fileData: FileEntity): AsyncResult<AppException, FileUrlEntity>;
  delete(fileName: string): AsyncResult<AppException, Unit>;
  exists(fileName: string): AsyncResult<AppException, boolean>;
  getFilePath(filename: string): string;
  getFileStream(
    fileName: string,
  ): AsyncResult<AppException, NodeJS.ReadableStream>;
}
