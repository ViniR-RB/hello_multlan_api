export default interface BaseFile {
  originalName: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
  encoding?: string;
}
