import SupabaseUploadException from 'src/core/erros/supabase.upload.exception';
import IUploadGateway from '../adapters/i_upload_gateway';
import FileEntity from '../domain/file.entity';
import IUploadFile, {
  UploadFileResponse,
} from '../domain/usecase/i_upload_file';

export default class UploadFileService implements IUploadFile {
  constructor(private readonly uploadGateway: IUploadGateway) {}
  call(file: FileEntity): Promise<UploadFileResponse> {
    try {
      const uploadFileResponse = this.uploadGateway.uploadFile(file);
      return uploadFileResponse;
    } catch (error) {
      if (error instanceof SupabaseUploadException) {
        throw error;
      }
    }
  }
}
