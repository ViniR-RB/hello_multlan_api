import FileEntity from '@/modules/upload/domain/file.entity';
import IUploadFile from '@/modules/upload/domain/usecase/i_upload_file';
import { Either, left, right } from 'src/core/either/either';
import BoxDomainException from 'src/core/erros/box.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import IBoxRepository from '../adapters/i_box_repository';
import IImageProcessingService from '../adapters/i_image_processing.service';
import BoxEntity from '../domain/box.entity';
import ICreateBoxUseCase, {
  CreateBoxPrams,
} from '../domain/usecases/i_create_box_use_case';

export default class CreateBoxService implements ICreateBoxUseCase {
  constructor(
    private readonly BoxRepository: IBoxRepository,
    private readonly imageProcessing: IImageProcessingService,
    private readonly uploadFile: IUploadFile,
  ) {}

  async call(
    boxData: CreateBoxPrams,
  ): Promise<Either<ServiceException, BoxEntity>> {
    try {
      const boxEntity = boxData.toEntity();

      const result = await this.BoxRepository.createBox(boxEntity);

      if (result.isLeft()) {
        return left(new ServiceException(result.value.message, 500));
      }

      const boxImage = await this.imageProcessing.convertToWebP(
        boxData.image.buffer,
        80,
      );

      const boxFile = new FileEntity(
        `${boxEntity.boxId}.webp`,
        boxImage,
        'box',
      );
      await this.uploadFile.call(boxFile);

      return right(boxEntity);
    } catch (error) {
      if (error instanceof BoxDomainException) {
        return left(new ServiceException(error.message, 400));
      }
      if (error instanceof ServiceException) {
        return left(error);
      }
      console.error(error);
      return left(new ServiceException('Erro inesperado', 500));
    }
  }
}
