import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IUpdateBoxUseCase, {
  UpdateBoxParam,
  UpdateBoxResponse,
} from '@/modules/box/domain/usecase/i_update_box_use_case';

export default class UpdateBoxService implements IUpdateBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
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
      const filteredId = {
        ...param,
        id: undefined,
      };
      boxFinder.value.updateBox({
        ...filteredId,
      });

      const boxUpdated = await this.boxRepository.save(boxFinder.value);

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
