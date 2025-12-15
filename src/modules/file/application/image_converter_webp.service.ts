import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import {
  ConverterResponse,
  default as IImageConverterWebp,
} from '@/modules/file/adapters/i_converter_webp';
import * as sharp from 'sharp';

export default class ImageConverterWebpServiceImpl
  implements IImageConverterWebp
{
  async execute(
    imageToWebp: Buffer,
  ): AsyncResult<AppException, ConverterResponse> {
    try {
      const { data, info } = await sharp(imageToWebp)
        .webp({ quality: 100 })
        .toBuffer({ resolveWithObject: true });
      const response = new ConverterResponse(info.format, data);
      return right(response);
    } catch (error) {
      return left(
        new ServiceException(
          'Error converting image to WebP format',
          500,
          error,
        ),
      );
    }
  }
}
