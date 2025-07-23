import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import OccurrenceEntity from '../occurrence.entity';

export default interface ICancelOccurrenceUseCase {
  call(
    params: CancelOccurrenceParams,
  ): Promise<Either<ServiceException, OccurrenceEntity>>;
}

export class CancelOccurrenceParams {
  id: string;
  userId: string;
  cancellationReason: string;

  constructor(id: string, userId: string, cancellationReason: string) {
    this.id = id;
    this.userId = userId;
    this.cancellationReason = cancellationReason;
  }
}
