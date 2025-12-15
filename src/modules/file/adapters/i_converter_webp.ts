import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';

export default interface IImageConverterWebp {
  execute(imageToWebp: Buffer): AsyncResult<AppException, ConverterResponse>;
}

export class ConverterResponse {
  constructor(
    public readonly format: string,
    public readonly fileConverted: Buffer,
  ) {}
}
