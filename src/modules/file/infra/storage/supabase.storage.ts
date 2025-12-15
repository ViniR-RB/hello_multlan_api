import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ConfigurationService from '@/core/services/configuration.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IFileStorage from '@/modules/file/adapters/i_file_storage';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileUrlEntity from '@/modules/file/domain/entities/file.url.entity';
import FileStorageException from '@/modules/file/exceptions/file_storage.exception';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default class SupabaseStorage implements IFileStorage {
  private readonly supabase: SupabaseClient<any, 'public', any>;
  constructor(private readonly configurationService: ConfigurationService) {
    const supabaseUrl = this.configurationService.get('SUPABASE_URL');
    const supabaseApiKey = this.configurationService.get('SUPABASE_API_KEY');
    this.supabase = createClient(supabaseUrl, supabaseApiKey);
  }
  async store(fileData: FileEntity): AsyncResult<AppException, FileUrlEntity> {
    try {
      const bucketName = this.configurationService.get(
        'SUPABASE_STORAGE_BUCKET',
      );
      const { data: dataUpload, error } = await this.supabase.storage
        .from(bucketName)
        .upload(fileData.filename, fileData.buffer, { upsert: true });
      if (error) {
        return left(
          new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
        );
      }

      return right(new FileUrlEntity(dataUpload.path));
    } catch (error) {
      return left(
        new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500),
      );
    }
  }
  async delete(fileName: string): AsyncResult<AppException, Unit> {
    try {
      await this.supabase.storage
        .from(this.configurationService.get('SUPABASE_STORAGE_BUCKET'))
        .remove([fileName]);
      return right(unit);
    } catch (e) {
      throw new FileStorageException(ErrorMessages.UNEXPECTED_ERROR, 500);
    }
  }
  exists(fileName: string): AsyncResult<AppException, boolean> {
    throw new Error('Method not implemented.');
  }
  getFilePath(filename: string): string {
    throw new Error('Method not implemented.');
  }
  getFileStream(
    fileName: string,
  ): AsyncResult<AppException, NodeJS.ReadableStream> {
    throw new Error('Method not implemented.');
  }
}
