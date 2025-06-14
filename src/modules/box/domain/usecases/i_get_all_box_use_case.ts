import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

export default interface IGetAllBoxUseCase {
  call(): Promise<Either<ServiceException, Array<GetAllBoxResponse>>>;
}
export class GetAllBoxResponse {
  static fromEntity(boxEntity: BoxEntity) {
    return boxEntity.toObject();
  }
}
