export default class FileEntity {
  constructor(
    public fileName: string,
    public buffer: Buffer,
    public storageName: string,
  ) {
    this.fileName = fileName;
    this.buffer = buffer;
    this.storageName = storageName;
  }
}
