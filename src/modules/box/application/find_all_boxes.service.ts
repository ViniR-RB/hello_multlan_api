import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IFindAllBoxesUseCase, {
  FindAllBoxesResponse,
} from '@/modules/box/domain/usecase/i_find_all_boxes_use_case';

export default class FindAllBoxesService implements IFindAllBoxesUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(): AsyncResult<AppException, FindAllBoxesResponse> {
    const boxesResult = await this.boxRepository.findAll();

    if (boxesResult.isLeft()) {
      return left(boxesResult.value);
    }

    return right(new FindAllBoxesResponse(boxesResult.value));
  }
}
