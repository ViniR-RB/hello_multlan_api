import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import ICreateBoxUseCase, {
  CreateBoxParam,
  CreateBoxResponse,
} from '@/modules/box/domain/usecase/i_create_box_use_case';
import IImageConverterWebp from '@/modules/file/adapters/i_converter_webp';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileEntity from '@/modules/file/domain/entities/file.entity';

export default class CreateBoxService implements ICreateBoxUseCase {
  constructor(
    private readonly boxRepository: IBoxRepository,
    private readonly fileRepository: IFileRepository,
    private readonly imageConverterWebp: IImageConverterWebp,
  ) {}
  async execute(
    param: CreateBoxParam,
  ): AsyncResult<AppException, CreateBoxResponse> {
    try {
      const boxEntity = BoxEntity.create({
        label: param.label,
        latitude: param.latitude,
        longitude: param.longitude,
        freeSpace: param.freeSpace,
        filledSpace: param.filledSpace,
        signal: param.signal,
        zone: param.zone,
        routeId: param.routeId,
        note: param.note,
        listUser: param.listUser,
        createdByUserId: param.createdByUserId,
      });

      const imageWebpConvertedResult = await this.imageConverterWebp.execute(
        param.boxFile.buffer,
      );

      if (imageWebpConvertedResult.isLeft()) {
        return left(imageWebpConvertedResult.value);
      }
      const fileName = `${boxEntity.id}.${imageWebpConvertedResult.value.format}`;

      boxEntity.updateImageUrl(fileName);

      const boxFileSaved = await this.fileRepository.save(
        new FileEntity({
          buffer: imageWebpConvertedResult.value.fileConverted,
          originalName: fileName,
          mimetype: `image/${imageWebpConvertedResult.value.format}`,
          filename: fileName,
          size: param.boxFile.size,
          encoding: param.boxFile.encoding,
        }),
      );
      if (boxFileSaved.isLeft()) {
        return left(boxFileSaved.value);
      }

      const boxSaved = await this.boxRepository.save(boxEntity);

      if (boxSaved.isLeft()) {
        await this.fileRepository.delete(fileName);
        return left(boxSaved.value);
      }
      return right(new CreateBoxResponse(boxSaved.value));
    } catch (e) {
      if (e instanceof AppException) {
        return left(e);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, e));
    }
  }
}
