import { SupabaseClient, createClient } from '@supabase/supabase-js';
import SupabaseUploadException from 'src/core/erros/supabase.upload.exception';

import ConfigurationService from 'src/core/services/configuration.service';
import IUploadGateway from '../adapters/i_upload_gateway';
import FileEntity from '../domain/file.entity';
import { UploadFileResponse } from '../domain/usecase/i_upload_file';
export default class UploadGateway implements IUploadGateway {
  private readonly supabase: SupabaseClient<any, 'public', any>;
  constructor(private readonly configurationService: ConfigurationService) {
    this.supabase = createClient(
      this.configurationService.get('SUPABASE_URL'),
      this.configurationService.get('SUPABASE_API_KEY'),
    );
  }

  async uploadFile(file: FileEntity): Promise<UploadFileResponse> {
    try {
      await this.supabase.storage
        .from(file.storageName)
        .upload(file.fileName, file.buffer, { upsert: true });
      const { data } = this.supabase.storage
        .from(file.storageName)
        .getPublicUrl(file.fileName);
      return new UploadFileResponse(data.publicUrl);
    } catch (error) {
      throw new SupabaseUploadException(
        'Error em fazer o upload do arquivo',
        400,
      );
    }
  }
}
