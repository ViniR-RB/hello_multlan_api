import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import OccurrenceEntity from '../domain/occurrence.entity';

export default interface IOccurrenceRepository {
  create(
    occurrence: OccurrenceEntity,
  ): Promise<Either<ServiceException, OccurrenceEntity>>;
  findAll(): Promise<Either<ServiceException, OccurrenceEntity[]>>;
  findById(
    id: string,
  ): Promise<Either<ServiceException, OccurrenceEntity | null>>;
  update(
    id: string,
    occurrence: OccurrenceEntity,
  ): Promise<Either<ServiceException, OccurrenceEntity>>;
  findByBoxId(
    boxId: string,
  ): Promise<Either<ServiceException, OccurrenceEntity[]>>;
}
