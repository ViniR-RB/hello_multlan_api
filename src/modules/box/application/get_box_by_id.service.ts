import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IGetBoxByIdUseCase, {
  GetBoxByIdParam,
  GetBoxByIdResponse,
} from '@/modules/box/domain/usecase/i_get_box_by_id_use_case';

export default class GetBoxByIdService implements IGetBoxByIdUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}

  async execute(
    param: GetBoxByIdParam,
  ): AsyncResult<AppException, GetBoxByIdResponse> {
    const boxFinder = await this.boxRepository.findOne({ boxId: param.boxId });

    if (boxFinder.isLeft()) {
      return left(boxFinder.value);
    }
    return right(new GetBoxByIdResponse(boxFinder.value));
  }
}
