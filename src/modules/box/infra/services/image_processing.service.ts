import ServiceException from '@/core/erros/service.exception';
import IImageProcessingService from '@/modules/box/adapters/i_image_processing.service';
import * as sharp from 'sharp';

export class ImageProcessingService implements IImageProcessingService {
  /**
   * Converte a imagem para o formato WebP.
   * @param buffer Buffer da imagem original
   * @param quality Qualidade da compressão (padrão: 80)
   * @returns Buffer da imagem convertida para WebP
   */
  async convertToWebP(
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
    quality = 80,
  ): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .webp({ quality }) // Converte para WebP com a qualidade especificada
        .toBuffer();
    } catch (error) {
      throw new ServiceException(
        `Erro ao converter a imagem para WebP: ${error.message}`,
        500,
      );
    }
  }
}
