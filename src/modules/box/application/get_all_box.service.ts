import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import IBoxRepository from '../adapters/i_box_repository';
import IGetAllBoxUseCase, {
  GetAllBoxParam,
} from '../domain/usecases/i_get_all_box_use_case';

export default class GetAllBoxService implements IGetAllBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
  async call(): Promise<Either<ServiceException, GetAllBoxParam[]>> {
    const result = await this.boxRepository.getAllBoxs();
    if (result.isLeft()) {
      return left(new ServiceException(result.value.message, 500));
    }
    const boxList = result.value.map((box) => box.toEntity());
    const listBoxParam = boxList.map((box) => GetAllBoxParam.fromEntity(box));

    return right(listBoxParam);
  }
}
