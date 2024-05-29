import FileEntity from '../file.entity';

export default interface IUploadFile {
  call(file: FileEntity): Promise<UploadFileResponse>;
}
export class UploadFileResponse {
  constructor(public url: string) {
    this.url = url;
  }
}
