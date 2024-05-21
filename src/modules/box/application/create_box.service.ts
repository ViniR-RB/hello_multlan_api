import { Either, left, right } from 'src/core/either/either';
import BoxDomainException from 'src/core/erros/box.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import IBoxRepository from '../adapters/i_box_repository';
import BoxEntity from '../domain/box.entity';
import ICreateBoxUseCase, {
  CreateBoxPrams,
} from '../domain/usecases/i_create_box_use_case';

export default class CreateBoxService implements ICreateBoxUseCase {
  constructor(private readonly BoxRepository: IBoxRepository) {}

  async call(
    boxData: CreateBoxPrams,
  ): Promise<Either<ServiceException, BoxEntity>> {
    try {
      const box = boxData.toEntity();
      const result = await this.BoxRepository.createBox(box);
      if (result.isLeft()) {
        return left(new ServiceException(result.value.message, 500));
      }
      return right(box);
    } catch (error) {
      if (error instanceof BoxDomainException) {
        return left(new ServiceException(error.message, 400));
      }
    }
  }
}
