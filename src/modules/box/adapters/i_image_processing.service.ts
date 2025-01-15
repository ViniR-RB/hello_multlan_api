export default interface IImageProcessingService {
  convertToWebP(
    buffer:
      | Buffer
      | ArrayBuffer
      | Uint8Array
      | Uint8ClampedArray
      | Int8Array
      | Uint16Array
      | Int16Array
      | Uint32Array
      | Int32Array
      | Float32Array
      | Float64Array
      | string,
    quality: number,
  ): Promise<Buffer>;
}
