import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IUpdateBoxUseCase, {
  UpdateBoxParam,
  UpdateBoxResponse,
} from '@/modules/box/domain/usecase/i_update_box_use_case';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileEntity from '@/modules/file/domain/entities/file.entity';

export default class UpdateBoxService implements IUpdateBoxUseCase {
  constructor(
    private readonly boxRepository: IBoxRepository,
    private readonly fileRepository: IFileRepository,
  ) {}
  async execute(
    param: UpdateBoxParam,
  ): AsyncResult<AppException, UpdateBoxResponse> {
    try {
      const boxFinder = await this.boxRepository.findOne({
        boxId: param.id,
      });

      if (boxFinder.isLeft()) {
        return left(boxFinder.value);
      }

      const box = boxFinder.value;

      if (param.boxFile) {
        const fileName = `${box.id}.${param.boxFile.originalName.split('.').pop()}`;

        if (box.imageUrl) {
          await this.fileRepository.delete(box.imageUrl);
        }

        const boxFileSaved = await this.fileRepository.save(
          new FileEntity({
            buffer: param.boxFile.buffer,
            originalName: fileName,
            mimetype: param.boxFile.mimetype,
            filename: fileName,
            size: param.boxFile.size,
            encoding: param.boxFile.encoding,
          }),
        );

        if (boxFileSaved.isLeft()) {
          return left(boxFileSaved.value);
        }

        box.updateImageUrl(fileName);
      }

      const { id, boxFile, ...updateData } = param;

      box.edit(updateData);

      const boxUpdated = await this.boxRepository.save(box);

      if (boxUpdated.isLeft()) {
        return left(boxUpdated.value);
      }

      return right(new UpdateBoxResponse(boxUpdated.value));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error as Error),
      );
    }
  }
}
