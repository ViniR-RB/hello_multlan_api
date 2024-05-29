import FileEntity from '../domain/file.entity';
import { UploadFileResponse } from '../domain/usecase/i_upload_file';

export default interface IUploadGateway {
  uploadFile(file: FileEntity): Promise<UploadFileResponse>;
}
