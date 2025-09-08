import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import IFileStorage from '@/modules/file/adapters/i_file_storage';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileUrlEntity from '@/modules/file/domain/entities/file.url.entity';

export default class FileLocalRepository implements IFileRepository {
  constructor(private readonly fileStorage: IFileStorage) {}
  async save(file: FileEntity): AsyncResult<AppException, FileUrlEntity> {
    return await this.fileStorage.store(file);
  }
  async delete(fileName: string): AsyncResult<AppException, Unit> {
    return await this.fileStorage.delete(fileName);
  }
}
