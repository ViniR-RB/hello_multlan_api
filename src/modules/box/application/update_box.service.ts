import { Either, left, right } from 'src/core/either/either';
import BoxDomainException from 'src/core/erros/box.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import IBoxRepository from '../adapters/i_box_repository';
import BoxEntity from '../domain/box.entity';
import IUpdateBoxUseCase, {
  UpdateBoxParams,
} from '../domain/usecases/i_update_box_use_case';

export default class UpdateBoxService implements IUpdateBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
  async call(
    boxData: UpdateBoxParams,
  ): Promise<Either<ServiceException, BoxEntity>> {
    try {
      const { id } = boxData;
      const resultSearch = await this.boxRepository.searchBoxFromIdOrThrow(id);
      if (resultSearch.isLeft()) {
        return left(new ServiceException(resultSearch.value.message, 404));
      }
      const boxEntity = boxData.toEntity();
      const resultUpdated = await this.boxRepository.updateBox(boxEntity);
      if (resultUpdated.isLeft()) {
        return left(new ServiceException(resultUpdated.value.message, 500));
      }
      return right(boxEntity);
    } catch (error) {
      if (error instanceof BoxDomainException) {
        return left(new ServiceException(error.message, 400));
      }
    }
  }
}
